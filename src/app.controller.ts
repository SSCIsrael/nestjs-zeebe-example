import { Controller, Get, Inject, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { CompleteFn, CreateWorkflowInstanceResponse, ZBClient } from 'zeebe-node/dist';
import { Ctx, Payload } from '@nestjs/microservices';
import { ZEEBE_CONNECTION_PROVIDER, ZeebeWorker } from '@payk/nestjs-zeebe/dist';

@Controller()
export class AppController {
  constructor(private readonly service : AppService,
              @Inject(ZEEBE_CONNECTION_PROVIDER) private readonly zbClient: ZBClient) {}

  @Get('/new/:orderValue')
  async startOrder(@Param('orderValue') orderValue: number): Promise<string> {
    const orderId = this.generateOrderId();
    try {
      await this.zbClient.createWorkflowInstance('order-process', {
        "orderId": orderId,
        "orderValue": Number(orderValue)
      });
    } catch (e) {
      return `failed to create workflow: ${e}`;
    }
    return String(orderId);
  }

  @Get('/confirm/:orderId')
  sendInvoiceMessage(@Param('orderId') orderId: string){
    return this.zbClient.publishMessage({
      correlationKey: orderId,
      messageId: orderId,
      name: 'payment-received',
      variables: { valueToAddToWorkflowVariables: 'here', status: 'PROCESSED' },
      timeToLive: 10000,
    })
  }

  @ZeebeWorker('initiate-payment', { maxJobsToActivate: 10, timeout: 300, debug: true })
  paymentService(@Payload() job, @Ctx() completeFn: CompleteFn<any>) {
    console.log('Payment-service, Task variables', job.variables);
    const updatedVariables = Object.assign({}, job.variables, {
      paymentService: 'Did my job',
    });

    // Task worker business logic goes here

    completeFn.success(updatedVariables);
  }

  @ZeebeWorker('ship-without-insurance', { maxJobsToActivate: 10, timeout: 300 })
  shipWithInsurance(@Payload() job, @Ctx() completeFn: CompleteFn<any>) {
    console.log('ship-without-insurance, Task variables', job.variables);
    const updatedVariables = Object.assign({}, job.variables, {
      inventoryVar: 'Shipping without insurance Done',
    });

    // Task worker business logic goes here

    completeFn.success(updatedVariables);
  }

  @ZeebeWorker('ship-with-insurance', { maxJobsToActivate: 10, timeout: 300 })
  shipWithoutInsurance(@Payload() job, @Ctx() completeFn: CompleteFn<any>) {
    console.log('ship-with-insurance, Task variables', job.variables);
    const updatedVariables = Object.assign({}, job.variables, {
      inventoryVar: 'Shipping without insurance Done',
    });

    // Task worker business logic goes here

    completeFn.success(updatedVariables);
  }

  generateOrderId() {
    return Math.floor(Math.random() * Math.floor(100));
  }
}

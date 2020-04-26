# Hands on NestJs + Zeeby (on GCP)

## Prerequisites
- Account on SSC's GCP
- `gcloud` installed
- `kubectl` installed
- Your IP is in whitelist for `ssc-cluster` on GCP

### GCP Auth
Run `gcloud init` and set you project as `coral-trilogy-251806` 

### kubectl
`$ kubectl get svc -n zeebe`

The service `zeebe-zeebe-gateway` should be listed.

Next, open port 26500 for **zbctl**:

`$ kubectl port-forward svc/zeebe-zeebe-gateway 26500 -n zeebe`


### install Zeebe command line tool
Official install https://docs.zeebe.io/introduction/quickstart.html

OR

`$ npm i -g zbctl`

### Deploy the BPMN file
`$ zbctl deploy ./order-process.bpmn  --insecure`

### Zeebe UI
Access Zeebe operate on

http://zeebe.sscisrael.com/



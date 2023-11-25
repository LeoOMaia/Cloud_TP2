# Cloud_TP2
DevOps and Cloud Computing

## Como Usar

Rodar ``server.py``, depois rodar ``client.py`` desse jeito: ``python client.py (song) (song) ...``

**server.py e client.py ESTÃO funcionando**

## to do:

- mudar porta do server e do client para a nossa
- configurar diretorio de freq.pkl e rules.pkl
- configurar melhor o jeito q vai ser recomendado as musicas (so esta printando "teste" nas recomendaçoes por enquanto)
- fazer os dockers

## Usando Kubernetes
- Deletar servicos existentes:
```
    kubectl delete deploy deployment-recomender
    kubectl delete service playlist-recommender-ml
    project-volume-leonardomaia
```
- Criar volume/deployment/service:
```
    kubectl -n leonardomaia apply -f persistent.yaml -f deployment.yaml -f service.yaml
```
- Ver Containers:
```
    kubectl get pods
    kubectl get services
    kubectl get pvc
```
- Ver Logs de um container:
```
    kubectl describe pod <nome do pod>
    kubectl describe service <nome do servico>
    kubectl describe pvc <nome do volume>
```
# Deploy da Paritins com runner na própria VM

O runner executa **apenas o job de deploy** na VM. Validação, testes e construção/publicação da imagem continuam nos runners hospedados pelo GitHub. O deploy local recebe a imagem por digest e atualiza o Compose.

A VM pode permanecer atrás da VPN: o runner inicia conexões de saída HTTPS para o GitHub e GHCR; não precisa de SSH de entrada para o pipeline. O acesso dos visitantes ao site (público ou pela VPN) é configurado separadamente no proxy HTTPS.

## 1. Preparar Linux x86_64

Instale Docker Engine, Compose plugin com suporte a `--wait`, Git e as dependências exigidas pelo instalador do GitHub Runner. Use uma versão atual do runner, compatível com `actions/checkout@v6`. A imagem atual é Linux AMD64; uma VM ARM exige alterar a arquitetura do build e o label do job.

Exemplo para criar o usuário, após instalar Docker:

```bash
sudo adduser deploy
sudo usermod -aG docker deploy
sudo -iu deploy
```

Teste na nova sessão:

```bash
docker info
docker compose version
```

O usuário não precisa executar o serviço como root. O acesso ao socket Docker, porém, dá privilégios elevados sobre a VM; reserve o runner para código confiável deste projeto. Use repositório privado, proteja `main` e configure o ambiente `production` para aceitar apenas `main`. Pull requests executam apenas os jobs hospedados no GitHub. Não adicione este runner a workflows de PR ou de código não confiável.

## 2. Cadastrar o runner

No repositório `Madgic-Inc/paritins`, abra **Settings → Actions → Runners → New self-hosted runner**, selecione Linux e x64.

Como usuário `deploy`, crie `~/actions-runner`, entre nele e execute os comandos de download e verificação exibidos pelo próprio GitHub. Eles contêm a versão atual e um token temporário de registro. Na etapa de configuração, inclua:

```bash
./config.sh --url https://github.com/Madgic-Inc/paritins \
  --token TOKEN_TEMPORARIO_DA_TELA_DO_GITHUB \
  --name paritins-production-vm \
  --labels paritins-production
```

Mantenha os labels padrão `self-hosted`, `linux` e `x64`. Não use `--no-default-labels`.

Não coloque o token de registro no repositório, no `.env` do site ou em mensagens. Ele é usado apenas no registro do runner.

Para instalar o serviço, execute a partir da pasta `actions-runner`, com uma conta que tenha sudo:

```bash
sudo ./svc.sh install deploy
sudo ./svc.sh start
sudo ./svc.sh status
```

Se você entrou como `deploy` e ele não tem sudo, volte para sua conta administrativa e execute esses comandos dentro de `/home/deploy/actions-runner`. O runner deve aparecer **Idle** no GitHub. O serviço será iniciado automaticamente após reboot.

## 3. Preparar a configuração persistente

O deploy exige `~/paritins/.env` já existente, contendo as credenciais do painel (`ADMIN_USER` e `ADMIN_PASSWORD` com 12+ caracteres). Execute como usuário do runner:

```bash
mkdir -p ~/paritins
chmod 700 ~/paritins
cat > ~/paritins/.env <<'ENV'
PORT=7000
BIND_ADDRESS=127.0.0.1
COOKIE_SECURE=true
ADMIN_USER=admin
ADMIN_PASSWORD=troque-por-uma-senha-forte
ENV
chmod 600 ~/paritins/.env
```

Configure HTTPS antes de acessar o login. Em HTTP local de teste, cookies seguros não são enviados; `COOKIE_SECURE=false` deve ficar restrito a esse cenário.

O caminho persistente é `$HOME/paritins` do usuário do serviço, separado de `~/actions-runner/_work`. O workflow preserva `.env`, `.deployed-image` e o volume do banco. O nome do projeto Compose permanece derivado de `return`; não altere diretório, `COMPOSE_PROJECT_NAME` ou usuário sem planejar a migração do volume. Se já houver uma instalação em outro caminho, migre seus dados antes de ativar este fluxo.

## 4. Configurar o GitHub

Crie **Settings → Environments → production**, permitindo deploy somente de `main`. Configure regras de proteção da branch conforme a equipe.

Em **Settings → Secrets and variables → Actions → Variables**, crie uma variável **de repositório**:

```text
DEPLOY_ENABLED=true
```

Ative apenas depois de preparar o runner e `.env`. Deixe ausente ou `false` para publicar imagens sem implantar.

Não são necessários secrets `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`, `DEPLOY_KNOWN_HOSTS` nem credenciais de VPN. O runner usa o `GITHUB_TOKEN` temporário com `packages: read` para baixar a imagem. O pacote `ghcr.io/madgic-inc/paritins` precisa permitir acesso de Actions a este repositório; em **Package settings → Manage Actions access**, conceda acesso ao repositório caso a imagem já exista sem essa associação. Para a primeira publicação, a organização precisa permitir a criação do pacote pelo workflow.

As credenciais Docker do job ficam em um diretório temporário e são removidas ao final, sem alterar o login Docker pessoal do usuário.

## 5. Publicar e acompanhar

O remoto já está configurado para `git@github.com:Madgic-Inc/paritins.git`. Na sua máquina:

```bash
git add .
git diff --cached --stat
git commit -m "Configura deploy local com runner na VM"
git push -u origin main
```

O workflow valida a aplicação, publica a imagem e agenda o job `deploy` no runner com os labels `[self-hosted, linux, x64, paritins-production]`. O job faz checkout fora do diretório persistente, autentica no GHCR, copia Compose e o script de implantação, baixa a imagem e aguarda o healthcheck. Deploys de produção não executam simultaneamente.

Na VM, como `deploy`:

```bash
cd ~/paritins
docker compose ps
docker compose logs --tail=100 web
docker compose exec web node scripts/admin-create.mjs
```

O último comando cria a conta administrativa de produção, com senha solicitada no terminal. Execute uma vez; use `--reset` quando quiser redefinir uma conta existente. A conta e os conteúdos locais não são enviados no build. Para migrá-los, utilize backup e restauração conforme o README.

## 6. Acesso pela VPN e HTTPS

O contêiner fica em `127.0.0.1:7000`. Para site privado, use proxy HTTPS acessível pela VPN (por exemplo, Tailscale Serve). Para site público, configure domínio e proxy Caddy/Nginx com HTTPS. Restringir SSH à VPN não restringe automaticamente `/admin`; se o painel precisar ser privado e o site público, configure essa separação no proxy.

A VM precisa conseguir acessar os domínios exigidos pelo GitHub Runner, o GHCR e os endpoints de download das camadas da imagem. Uma VPN sem saída para esses serviços impede o deploy; não é necessário liberar o SSH público.

## Backups, rollback e diagnóstico

O deploy faz um backup no volume quando o contêiner anterior já possui o script do CMS. Se a nova imagem não ficar saudável, tenta restaurar a imagem anterior registrada em `.deployed-image`. Isso não restaura o banco automaticamente. Mantenha cópias de backup fora da VM e configure retenção.

Rollback manual:

```bash
cd ~/paritins
# Para imagem privada, autentique com uma credencial read:packages nesta sessão.
docker login ghcr.io -u SEU_USUARIO_GITHUB
sh deploy.sh ghcr.io/madgic-inc/paritins@sha256:DIGEST_ANTERIOR
```

O login temporário do Actions já terá sido removido, por isso uma operação manual pode exigir autenticação própria. `docker compose down` preserva dados; `docker compose down -v` remove o volume.

Se o job ficar em **Queued**, confira runner online, labels, acesso do repositório ao runner e regras do ambiente. Se houver **permission denied no Docker**, confira o grupo `docker` do usuário e reinicie o serviço do runner após corrigir. Erro **denied no GHCR** indica permissões do pacote/repositório. Erro de `.env` ausente indica caminho/home diferente do usuário que preparou a VM.

Fontes oficiais: [Adicionar runners](https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/add-runners), [serviço Linux](https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/configure-the-application), [rede de saída](https://docs.github.com/en/actions/reference/runners/self-hosted-runners), [labels](https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/apply-labels).

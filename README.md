### Projeto Metanoia





## Sobre o Projeto

Projeto Metanoia é uma plataforma de aprendizado online que permite professores criarem "jornadas" educacionais com aulas em vídeo e materiais de apoio. Os alunos podem se inscrever nas jornadas, acompanhar seu progresso e acessar os conteúdos de forma organizada.

A plataforma foi desenvolvida para funcionar em um ambiente auto-hospedado, com foco em simplicidade, segurança e facilidade de uso.

## Tecnologias Utilizadas

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Next.js API Routes
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT (JSON Web Tokens)
- **Armazenamento**: Sistema de arquivos local
- **Servidor**: Nginx, PM2


## Requisitos do Sistema

- Node.js 18 ou superior
- PostgreSQL 15 ou superior
- Nginx
- Servidor Ubuntu (recomendado)
- Mínimo de 1GB de RAM
- Pelo menos 10GB de espaço em disco (para armazenar vídeos e materiais)


## Instalação e Configuração

### 1. Preparação do Servidor

Execute o script de configuração da VPS:

```shellscript
# Baixe o script
wget https://raw.githubusercontent.com/seu-usuario/projeto-metanoia/main/scripts/setup-vps.sh

# Torne-o executável
chmod +x setup-vps.sh

# Execute como root ou com sudo
sudo ./setup-vps.sh
```

O script irá:

- Instalar todas as dependências necessárias
- Configurar o PostgreSQL
- Configurar o Nginx
- Configurar o SSL com Let's Encrypt
- Criar diretórios e permissões
- Preparar o ambiente para a aplicação


### 2. Configuração do Banco de Dados

Após a instalação, execute o script de seed para criar as tabelas e dados iniciais:

```shellscript
cd /var/www/metanoia
./setup-db.sh
```

### 3. Configuração do Ambiente

Verifique e ajuste o arquivo `.env` conforme necessário:

```shellscript
nano /var/www/metanoia/.env
```

Certifique-se de que as seguintes variáveis estão configuradas corretamente:

```plaintext
NODE_ENV=production
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=metanoia
DB_USER=metanoia_user
DB_PASSWORD=sua_senha_segura

# JWT
JWT_SECRET=seu_segredo_jwt

# Storage
STORAGE_PATH=/var/www/metanoia/storage
```

### 4. Iniciar a Aplicação

```shellscript
cd /var/www/metanoia
./start.sh
```

Configure o PM2 para iniciar automaticamente na inicialização do sistema:

```shellscript
pm2 startup
pm2 save
```

## Estrutura do Projeto

```plaintext
projeto-metanoia/
├── app/                    # Diretório principal da aplicação Next.js
│   ├── api/                # API Routes
│   ├── dashboard/          # Páginas do painel administrativo
│   ├── login/              # Página de login
│   ├── register/           # Página de registro
│   └── ...
├── db/                     # Scripts e esquemas do banco de dados
├── lib/                    # Bibliotecas e utilitários
│   ├── auth.ts             # Funções de autenticação
│   ├── db.ts               # Conexão com o banco de dados
│   ├── file-utils.ts       # Utilitários para manipulação de arquivos
│   └── ...
├── middleware.ts           # Middleware para proteção de rotas
├── public/                 # Arquivos estáticos
└── scripts/                # Scripts utilitários
    ├── seeds.ts            # Script para popular o banco de dados
    └── setup-vps.sh        # Script para configurar o servidor
```

## Funcionalidades Principais

### Para Administradores

- Gerenciamento completo de usuários
- Atribuição de funções (admin, professor, aluno)
- Monitoramento da plataforma


### Para Professores

- Criação e gerenciamento de jornadas educacionais
- Upload de vídeos e materiais de apoio
- Organização de aulas em sequência lógica
- Publicação/despublicação de jornadas


### Para Alunos

- Inscrição em jornadas disponíveis
- Visualização de aulas em vídeo
- Download de materiais de apoio
- Acompanhamento de progresso
- Marcação de aulas como concluídas


## API

A API do Projeto Metanoia é organizada nos seguintes endpoints:

### Autenticação

- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de novo usuário
- `POST /api/auth/logout` - Logout de usuário
- `GET /api/auth/me` - Obter informações do usuário atual


### Jornadas

- `GET /api/journeys/enrolled` - Listar jornadas em que o usuário está inscrito
- `GET /api/journeys/available` - Listar jornadas disponíveis para inscrição
- `GET /api/journeys/:id` - Obter detalhes de uma jornada
- `POST /api/journeys/:id/enroll` - Inscrever-se em uma jornada


### Aulas

- `GET /api/journeys/:journeyId/lessons/:lessonId` - Obter detalhes de uma aula
- `POST /api/journeys/:journeyId/lessons/:lessonId/progress` - Salvar progresso em uma aula
- `POST /api/journeys/:journeyId/lessons/:lessonId/complete` - Marcar aula como concluída


### Gerenciamento de Jornadas (Professores)

- `GET /api/teacher/journeys` - Listar jornadas do professor
- `POST /api/teacher/journeys` - Criar nova jornada
- `GET /api/teacher/journeys/:id` - Obter detalhes de uma jornada
- `PUT /api/teacher/journeys/:id` - Atualizar jornada
- `DELETE /api/teacher/journeys/:id` - Excluir jornada
- `POST /api/teacher/journeys/:id/publish` - Publicar/despublicar jornada


### Gerenciamento de Aulas (Professores)

- `POST /api/teacher/journeys/:journeyId/lessons` - Criar nova aula
- `PUT /api/teacher/journeys/:journeyId/lessons/:lessonId` - Atualizar aula
- `DELETE /api/teacher/journeys/:journeyId/lessons/:lessonId` - Excluir aula
- `POST /api/teacher/journeys/:journeyId/lessons/:lessonId/move` - Reordenar aula


### Administração

- `GET /api/admin/users` - Listar todos os usuários
- `POST /api/admin/users` - Criar novo usuário
- `PUT /api/admin/users/:id` - Atualizar usuário
- `DELETE /api/admin/users/:id` - Excluir usuário


## Manutenção

### Backup do Banco de Dados

Recomenda-se configurar backups regulares do banco de dados:

```shellscript
# Criar backup
pg_dump -U metanoia_user -d metanoia > backup_$(date +%Y%m%d).sql

# Restaurar backup
psql -U metanoia_user -d metanoia < backup_arquivo.sql
```

### Backup de Arquivos

Faça backup regular do diretório de armazenamento:

```shellscript
tar -czf storage_backup_$(date +%Y%m%d).tar.gz /var/www/metanoia/storage
```

### Atualização da Aplicação

Para atualizar a aplicação:

```shellscript
cd /var/www/metanoia
git pull
npm install
npm run build
pm2 restart metanoia
```

## Solução de Problemas

### Logs da Aplicação

```shellscript
# Ver logs do PM2
pm2 logs metanoia

# Ver logs do Nginx
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

### Problemas Comuns

1. **Erro de conexão com o banco de dados**

1. Verifique se o PostgreSQL está em execução: `systemctl status postgresql`
2. Verifique as credenciais no arquivo `.env`



2. **Erro ao fazer upload de arquivos**

1. Verifique as permissões do diretório de armazenamento: `ls -la /var/www/metanoia/storage`
2. Verifique o limite de tamanho de upload no Nginx: `client_max_body_size` em `/etc/nginx/sites-available/metanoia`



3. **Certificado SSL expirado**

1. Renove o certificado: `certbot renew`





## Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request


## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).

## Contato

Para suporte ou mais informações, entre em contato através do site [projetometanoia.com.br](https://projetometanoia.com.br) ou pelo email [contato@projetometanoia.com.br](mailto:contato@projetometanoia.com.br).

---

Desenvolvido com ❤️ para o Projeto Metanoia.

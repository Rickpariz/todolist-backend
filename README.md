
# Todo List
Serviço para gerenciar lista de tarefas com autenticação.

## Pré-requisitos

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Configuração e Execução do Projeto

Siga os passos abaixo para configurar e executar o projeto:

### 1. Rodando a aplicação

A aplicação está configurada com containers docker, então a inicialização será bem simples.
Utilize o comando abaixo para subir os contêineres e aguarde a inicialização:

```sh
docker-compose up --build
```

### 2. Acesse a documentação

A API foi documentada utilizando o swagger, e a mesma pode ser acessada na rota ```http://localhost:3000/docs``` assim que a aplicação estiver rodando.

## Arquitetura e estrutura de dados

### Estrutura do projeto

O projeto foi estruturando seguindo o padrão de **Domain-Driven Design (DDD)**
```
src/
├── modules/
│   ├── module/                     # Representa um contexto ou funcionalidade do domínio
│   │   ├── application/            # Casos de uso e serviços que orquestram as regras de negócio
│   │   │   └── use-cases/
│   │   ├── domain/                 # Entidades e interfaces do domínio
│   │   │   ├── entities/
│   │   │   ├── repositories/
│   │   ├── infrastructure/         # Implementações específicas da infraestrutura
│   │   │   ├── database/           # Configuração de repositórios
|   |   |   ├── factory             # Factories
│   │   │   ├── http/               # Controladores e rotas para interfaces HTTP
│   │   │   |  ├── controllers/
│   │   │   |  └── routes/
│   │   └── shared/                 # Componentes compartilhados dentro do módulo
└── shared/                         # Componentes globais que podem ser utilizados por diferentes módulos
```

## Fluxo de redefinição de senha

O fluxo de **reset de senha** possibilita que os usuários redefinam suas senhas de forma segura e eficiente. Para facilitar os testes, o **token de redefinição** será incluído diretamente na resposta da API `POST /request-password-reset`. Vale ressaltar que, em um cenário real, esse token seria enviado exclusivamente para o e-mail do usuário, garantindo maior segurança e privacidade.


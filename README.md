# HealthConnect - Sistema de Marcação de Consultas Médicas

<div align="center">

![HealthConnect Logo](https://via.placeholder.com/200x80/0066CC/FFFFFF?text=HealthConnect)

**Plataforma moderna para agendamento de consultas médicas**

[![React Native](https://img.shields.io/badge/React%20Native-0.76.7-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-52.0.39-blue.svg)](https://expo.dev/)
[![Styled Components](https://img.shields.io/badge/Styled%20Components-6.1.16-DB7093.svg)](https://styled-components.com/)

</div>

## 📋 Sobre o Projeto

O HealthConnect é uma aplicação mobile desenvolvida em React Native e TypeScript que permite aos pacientes agendar consultas médicas de forma simples e intuitiva. O sistema oferece uma interface moderna, validações robustas e uma experiência de usuário otimizada.

### 🎯 Objetivos

- Facilitar o agendamento de consultas médicas
- Oferecer uma interface intuitiva e acessível
- Implementar validações consistentes e feedbacks visuais
- Manter uma identidade visual coesa e profissional

## 🎨 Identidade Visual

### Cores
- **Primária (Azul Médico)**: `#0066CC` - Transmite confiança e profissionalismo
- **Secundária (Verde Saúde)**: `#00A878` - Representa bem-estar e cura
- **Fundo**: `#F8FCFF` - Branco azulado para limpeza visual
- **Texto Principal**: `#1A202C` - Alta legibilidade
- **Erros**: `#E53E3E` - Vermelho suave para mensagens de erro
- **Sucesso**: `#00C896` - Verde vibrante para feedbacks positivos

### Tipografia
- **Títulos**: 28px, peso 700
- **Subtítulos**: 18px, peso 600
- **Corpo**: 16px, peso 400
- **Legendas**: 14px, peso 400
- **Pequeno**: 12px, peso 400

### Ícones e Imagens
- Utilização de ícones Ionicons para consistência visual
- Imagens de perfil fixas para médicos e pacientes via Unsplash URLs
- Avatares padronizados com bordas e sombras suaves
- Imagens profissionais de alta qualidade (150x150px)

## 📱 Telas e Funcionalidades

### 1. Tela de Login (`LoginScreen`)
- **Design**: Header com logo e formulário moderno
- **Validações**: Email e senha com feedback em tempo real
- **Recursos**:
  - Mostrar/ocultar senha
  - Validação de formato de email
  - Mensagens de erro específicas
  - Botão de "Esqueceu a senha"
  - Contas de demonstração para testes

### 2. Tela de Cadastro (`RegisterScreen`)
- **Design**: Interface limpa com validações progressivas
- **Validações**:
  - Nome (mínimo 3 caracteres)
  - Email (formato válido)
  - Senha (mínimo 6 caracteres)
  - Confirmação de senha
- **Recursos**:
  - Indicadores visuais de requisitos de senha
  - Limpeza automática de erros ao digitar
  - Termos de serviço e política de privacidade

### 3. Tela Principal (`HomeScreen`)
- **Design**: Header dinâmico com saudações personalizadas
- **Recursos**:
  - Saudação baseada no horário (Bom dia/Boa tarde/Boa noite)
  - Contador de consultas agendadas e pendentes
  - Cards de consultas com informações detalhadas
  - Status visual (Confirmado/Pendente/Cancelado)
  - Botões flutuantes de ação (editar/cancelar)
  - Estado vazio com mensagem amigável

### 4. Agendamento (`CreateAppointmentScreen`)
- **Design**: Fluxo em múltiplos passos com navegação intuitiva
- **Recursos**:
  - **Calendário funcional integrado**: Navegação mensal com seleção visual de datas
  - **Seleção de horários**: Slots horários em carrossel horizontal
  - **Lista de médicos**: Cards com foto profissional, nome e especialidade
  - **Formulário de descrição**: Campo para observações
  - **Validações**: Verificação de campos obrigatórios e datas futuras

### 5. Perfil (`ProfileScreen`)
- **Design**: Interface moderna com informações organizadas
- **Recursos**:
  - Foto de perfil com opção de edição
  - Informações pessoais organizadas
  - Estatísticas de consultas
  - Configurações de preferências

## 🔧 Tecnologias Utilizadas

### Core
- **React Native**: Framework base para desenvolvimento mobile
- **TypeScript**: Tipagem estática para maior robustez
- **Expo**: Plataforma de desenvolvimento e deploy

### Estilização
- **Styled Components**: CSS-in-JS para componentes estilizados
- **Theme System**: Sistema unificado de cores e tipografia

### Navegação
- **React Navigation**: Navegação entre telas e gerenciamento de rotas

### Estado e Dados
- **Context API**: Gerenciamento de estado global (autenticação)
- **Async Storage**: Persistência de dados local
- **JWT**: Autenticação via tokens

### UI/UX
- **Ionicons**: Biblioteca de ícones consistente
- **React Native Elements**: Componentes UI pré-estilizados
- **Custom Components**: Componentes específicos para o sistema

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn
- Expo CLI instalado globalmente
- Dispositivo físico ou emulador iOS/Android

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/marcacaoDeConsultasMedicas.git
cd marcacaoDeConsultasMedicas
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Inicie o servidor de desenvolvimento**
```bash
npm start
# ou
yarn start
```

4. **Execute no dispositivo**
- Use o app Expo Go no seu dispositivo e escaneie o QR code
- Ou execute no emulador:
  - Android: `npm run android`
  - iOS: `npm run ios`
  - Web: `npm run web`

## 📱 Contas de Demonstração

O sistema inclui contas pré-configuradas para testes:

### Administrador
- **Email**: admin@example.com
- **Senha**: 123456
- **Acesso**: Painel administrativo completo

### Médicos
- **Dr. João Silva**: joao@example.com / 123456 (Cardiologista)
- **Dra. Maria Santos**: maria@example.com / 123456 (Pediatria)
- **Dr. Pedro Oliveira**: pedro@example.com / 123456 (Ortopedia)
- **Dra. Ana Costa**: ana.doctor@example.com / 123456 (Dermatologia)
- **Dr. Carlos Mendes**: carlos.doctor@example.com / 123456 (Clínico Geral)

### Pacientes
- **João Teste**: teste@paciente.com / 123456
- **Ana Paciente**: ana@exemplo.com / 123456
- **Carlos Paciente**: carlos@exemplo.com / 123456
- **Maria Paciente**: maria@exemplo.com / 123456
- **Pedro Usuário**: pedro@usuario.com / 123456

**Todos os usuários utilizam a senha: 123456**

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── FeedbackMessages.tsx
│   ├── CalendarPicker.tsx
│   ├── TimeSlotList.tsx
│   ├── AppointmentActionModal.tsx
│   └── StatusBadge.tsx
├── contexts/           # Contextos globais
│   └── AuthContext.tsx
├── navigation/         # Configuração de navegação
│   └── AppNavigator.tsx
├── screens/           # Telas da aplicação
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── HomeScreen/
│   │   ├── index.tsx
│   │   ├── styles.ts
│   │   ├── hooks/
│   │   └── services/
│   ├── CreateAppointmentScreen/
│   │   ├── index.tsx
│   │   ├── styles.ts
│   │   ├── models/
│   │   └── services/
│   ├── DoctorDashboardScreen.tsx
│   ├── PatientDashboardScreen.tsx
│   ├── AdminDashboardScreen.tsx
│   ├── UserManagementScreen.tsx
│   ├── ProfileScreen/
│   ├── EditProfileScreen/
│   ├── SettingsScreen.tsx
│   └── NotificationsScreen.tsx
├── services/          # Serviços e API
│   ├── auth.ts
│   ├── appointments.ts
│   ├── profileImages.ts
│   ├── statistics.ts
│   ├── notifications.ts
│   └── imageService.ts
├── styles/            # Estilos globais
│   ├── theme.ts
│   └── globalStyles.ts
└── types/             # Definições de tipos TypeScript
    ├── auth.ts
    ├── appointments.ts
    ├── doctors.ts
    └── navigation.ts
```

## 🔧 Arquitetura em Camadas

### 1. **Camada de Apresentação (UI)**
- **Components**: Componentes reutilizáveis e independentes
- **Screens**: Telas da aplicação com lógica de apresentação
- **Estilos**: Sistema unificado com theme.ts e styled-components

### 2. **Camada de Negócio (Business)**
- **Services**: Lógica de negócio e regras de domínio
- **Hooks**: Hooks customizados para lógica compartilhada
- **Models**: Estruturas de dados e interfaces

### 3. **Camada de Dados (Data)**
- **Context**: Estado global da aplicação
- **Storage**: Persistência local com AsyncStorage
- **Types**: Definições TypeScript para type safety

### 4. **Camada de Infraestrutura (Infrastructure)**
- **Navigation**: Configuração de rotas e navegação
- **API**: Comunicação com serviços externos
- **Utils**: Funções utilitárias compartilhadas

## 🎯 Princípios de Design

### Cores e Acessibilidade
- Alto contraste para melhor legibilidade
- Cores consistentes em toda a aplicação
- Feedback visual claro para todas as ações

### Tipografia
- Hierarquia visual clara através de tamanhos e pesos
- Fontes legíveis em diferentes tamanhos de tela
- Espaçamento consistente para melhor fluidez

### Componentes
- Componentes reutilizáveis e bem documentados
- Props tipadas para desenvolvimento seguro
- Estilos responsivos e adaptativos

### Feedback Visual
- Indicadores de loading para operações assíncronas
- Mensagens de erro claras e específicas
- Feedback de sucesso para ações concluídas

## 🔄 Fluxo de Navegação

1. **Login/Cadastro** → Validação de credenciais
2. **Home** → Dashboard com consultas agendadas
3. **Agendar** → Seleção de médico, data e horário
4. **Perfil** → Gerenciamento de informações pessoais

## 🧪 Validações Implementadas

### Login
- Formato de email válido
- Campo de senha obrigatório
- Feedback de erro específico

### Cadastro
- Nome completo (mínimo 3 caracteres)
- Email com formato válido
- Senha (mínimo 6 caracteres)
- Confirmação de senha idêntica

### Agendamento
- Seleção de médico obrigatória
- Data futura obrigatória
- Horário de atendimento válido

## 📊 Estrutura de Dados

### Consultas (Appointments)
```typescript
interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  description?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}
```

### Médicos (Doctors)
```typescript
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}
```

## 🚀 Deploy e Produção

### Build para Produção
```bash
# Android
expo build:android

# iOS
expo build:ios

# Web
expo build:web
```

### Publicação na Stores
- Configurar app.json com informações do app
- Gerar build assinado para cada plataforma
- Submeter para Apple App Store e Google Play Store

## 📝 Histórico de Commits

O projeto segue uma estratégia de commits pequenos, frequentes e descritivos:

### Padrão de Commits
- **feat**: Novas funcionalidades
- **fix**: Correção de bugs
- **refactor**: Refatoração de código
- **style**: Ajustes de formatação e estilo
- **docs**: Atualizações na documentação
- **test**: Adição ou correção de testes

### Exemplos de Commits Recentes
```
feat: implementar calendário funcional integrado
fix: corrigir erro de theme não definido no DashboardScreen
refactor: substituir imagens aleatórias por URLs fixas Unsplash
feat: adicionar UserManagementScreen ao AppNavigator
fix: corrigir navegação para tela de gerenciamento de usuários
style: atualizar identidade visual com tema médico
docs: atualizar README com instruções completas
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças seguindo o padrão estabelecido
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request com descrição detalhada

## 📊 Critérios de Avaliação Atendidos

### ✅ Consistência Visual e Acessibilidade
- [x] Paleta de cores coerente com tema saúde
- [x] Tipografia consistente e hierárquica
- [x] Alto contraste para melhor legibilidade
- [x] Feedback visual claro para todas as ações
- [x] Design responsivo e adaptativo

### ✅ Qualidade e Organização do Código
- [x] Arquitetura em camadas bem definida
- [x] Uso consistente de theme.ts
- [x] Tipagem TypeScript completa
- [x] Componentes reutilizáveis
- [x] Código limpo e documentado

### ✅ Validações e Feedbacks Implementados
- [x] Login com validação de email e senha
- [x] Cadastro com validações progressivas
- [x] Feedbacks visuais (loading, sucesso, erro)
- [x] Mensagens de erro claras e específicas
- [x] Validação de datas futuras no agendamento

### ✅ Funcionalidades Implementadas
- [x] Calendário funcional e integrado
- [x] Sistema de agendamento completo
- [x] Dashboard por tipo de usuário
- [x] Gerenciamento de perfil
- [x] Sistema de notificações

### ✅ Substituição Correta das Imagens
- [x] Imagens fixas para todos os médicos
- [x] Imagens fixas para todos os pacientes
- [x] URLs profissionais do Unsplash
- [x] Otimização de tamanho (150x150px)
- [x] Crop facial automático

## 📄 Licença

Este projeto está licenciado sob a licença 0BSD - veja o arquivo LICENSE para detalhes.

---

**Desenvolvido com ❤️ para facilitar o acesso à saúde**

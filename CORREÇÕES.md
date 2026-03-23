# Correções Aplicadas no Projeto

## 1. Assets Faltantes (expo-doctor)
- **Problema**: `app.json` referenciava `./assets/icon.png`, `./assets/splash-icon.png`, `./assets/adaptive-icon.png` e `./assets/favicon.png` que não existiam.
- **Solução**: Criada pasta `assets/` e script `scripts/create-assets.js` para gerar placeholders PNG válidos.
- **Recomendação**: Substitua os placeholders por ícones e splash de 1024x1024px para produção.

## 2. Dependências (expo-doctor)
- **Problema**: Versões incompatíveis com Expo SDK 52:
  - `@react-native-async-storage/async-storage@2.2.0` → esperado: 1.23.1
  - `expo@52.0.38` → esperado: ~52.0.49
  - `react-native@0.76.7` → esperado: 0.76.9
  - `react-native-gesture-handler@2.24.0` → esperado: ~2.20.2
- **Solução**: Execute `npx expo install --check` e confirme as atualizações quando não houver lock de arquivos (evite rodar com outros processos usando node_modules).

## 3. Código - CreateAppointmentScreen
- **Problema**: `loadAvailableSlots` não tratava erros; em caso de falha, `loadingSlots` permanecia `true`.
- **Solução**: Adicionados `try/catch/finally` para tratar exceções e garantir `setLoadingSlots(false)`.

## 4. Código - Input (componente UI)
- **Problema**: Uso de `as any` no ícone; `accessibilityLabel` do pai era ignorado.
- **Solução**: 
  - Tipagem correta: `rightIcon.name` como `'eye' | 'eye-off'`
  - Suporte a `accessibilityLabel` customizado via prop
  - Remoção do cast desnecessário

## 5. Acessibilidade - AppRoutes
- **Problema**: Tela de loading sem rótulo para leitores de tela.
- **Solução**: Adicionado `accessibilityLabel="Carregando aplicação"` na View de loading.

## 6. ESLint
- **Configuração**: Adicionado `.eslintrc.js` e scripts `lint` / `lint:fix` no `package.json`.
- **Uso**: Execute `npm run lint` após instalar dependências de desenvolvimento (ESLint 8 + plugins).

## Comandos Úteis
```bash
# Verificar saúde do projeto
npx expo-doctor

# Corrigir dependências
npx expo install --check

# Rodar lint (após npm install)
npm run lint
npm run lint:fix
```

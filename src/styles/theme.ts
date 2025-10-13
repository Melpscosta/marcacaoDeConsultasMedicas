export default {
  // Paleta de cores inspirada no setor de saúde - limpeza, confiança e profissionalismo
  colors: {
    // Azuis médicos - confiança, calma e profissionalismo
    primary: '#0066CC',        // Azul médico principal
    primaryLight: '#E6F2FF',   // Azul muito claro para fundos
    primaryDark: '#004499',    // Azul mais escuro para acentos

    // Verde saúde - cura, bem-estar e sucesso
    secondary: '#00A878',      // Verde saúde
    secondaryLight: '#E6FAF4', // Verde muito claro
    success: '#00C896',        // Verde sucesso vibrante

    // Cores de fundo - limpas e acolhedoras
    background: '#F8FCFF',     // Branco azulado muito claro
    surface: '#FFFFFF',        // Branco puro para cards
    cardBackground: '#FFFFFF', // Fundo de cards

    // Cores de texto - alta legibilidade
    text: '#1A202C',          // Texto principal (quase preto)
    textLight: '#4A5568',     // Texto secundário
    textMuted: '#718096',     // Texto desativado/hints

    // Cores de status
    error: '#E53E3E',         // Vermelho erro (mais suave que o anterior)
    warning: '#DD6B20',       // Laranja advertência
    info: '#3182CE',          // Azul informação

    // Neutros para borders e divisores
    border: '#E2E8F0',        // Border suave
    divider: '#CBD5E0',       // Divisor

    // Cores adicionais para elementos específicos
    white: '#FFFFFF',
    shadow: 'rgba(0, 102, 204, 0.1)', // Sombra com cor primária

    // Cores para consultas/agendamentos
    appointmentConfirmed: '#00C896',
    appointmentPending: '#DD6B20',
    appointmentCancelled: '#E53E3E',

    // Gradientes para botões e elementos importantes
    gradients: {
      primary: ['#0066CC', '#004499'],
      secondary: ['#00A878', '#008866'],
      success: ['#00C896', '#00A878'],
    }
  },

  // Tipografia moderna e acessível
  typography: {
    // Font families (React Native padrão)
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },

    // Tamanhos e pesos consistentes
    title: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 34,
      letterSpacing: -0.5,
    },
    heading: {
      fontSize: 22,
      fontWeight: '600',
      lineHeight: 28,
      letterSpacing: -0.25,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 24,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 22,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 18,
    },
    small: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
    },
  },

  // Espaçamento consistente baseado em 8px
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  // Border radius para elementos consistentes
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999, // Para elementos circulares
  },

  // Sombras para profundidade visual
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
  },

  // Tamanhos de componentes
  sizes: {
    buttonHeight: {
      sm: 36,
      md: 44,
      lg: 52,
    },
    inputHeight: {
      sm: 36,
      md: 44,
      lg: 52,
    },
    icon: {
      sm: 16,
      md: 20,
      lg: 24,
      xl: 32,
    },
    avatar: {
      sm: 32,
      md: 40,
      lg: 56,
      xl: 80,
    },
  },

  // Animações e transições
  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
  },
};
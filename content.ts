
import { ChristianFaith } from './types';

export const APP_TEXT = {
  general: {
    appName: "Bíblia Sertaneja",
    appNameHighlight: "Sertaneja",
    loading: "Carregando...",
    footer: "Protected by DRM • HLS Streaming"
  },
  welcome: {
    heroTitle: "Bíblia",
    heroSubtitle: "Histórias da Bíblia transformadas em canções sertanejas.", // Tagline
    
    // Updated Hierarchy - No more banner context
    offerTitle: "Cadastre-se e ganhe 24H de Premium Grátis com acesso total",
    offerSubtitle: "Sem compromisso e sem cartão",
    
    ctaRegister: "24h de Premium Grátis",
    ctaLogin: "Já tenho conta / Entrar",
    ctaGuest: "Ouvir trechos de Graça",
    footerTagline: "Música • Fé • Tradição"
  },
  auth: {
    loginTitle: "Bem-vindo(a) de volta",
    loginSubtitle: "Insira suas credenciais para acessar.",
    
    // Onboarding Steps
    steps: {
      email: {
        title: "Qual é o seu e-mail?",
        subtitle: "Você precisará confirmar este e-mail mais tarde.",
        placeholder: "seu@email.com"
      },
      password: {
        title: "Crie uma senha",
        subtitle: "Use pelo menos 6 caracteres.",
        placeholder: "Senha"
      },
      demographics: {
        title: "Conte sobre você",
        subtitle: "Para sugerirmos os melhores louvores.",
        labelDate: "Data de Nascimento",
        labelGender: "Gênero"
      },
      name: {
        title: "Qual o seu nome?",
        subtitle: "É assim que vai aparecer no seu perfil.",
        placeholder: "Seu nome"
      },
      faith: {
        title: "Qual a sua fé cristã?",
        subtitle: "Personalizamos o app com base na sua tradição.",
      }
    },
    
    inputName: "Nome",
    inputEmail: "E-mail",
    inputPassword: "Senha",
    inputBirthdate: "Data de Nascimento",
    inputGender: "Gênero",
    inputFaith: "Qual a sua fé cristã?",
    faithOptions: {
      catholic: "Católica",
      evangelical: "Evangélica"
    },
    genderOptions: {
      female: "Feminino",
      male: "Masculino",
      other: "Outro",
      prefer_not_say: "Prefiro não dizer"
    },
    actionLogin: "Entrar",
    actionRegister: "Criar Conta",
    actionNext: "Próximo",
    toggleLogin: "Já tem uma conta?",
    toggleRegister: "Não tem conta? Cadastre-se para 24h de Premium Grátis",
    toggleRegisterSub: "Sem compromisso e sem cartão",
    linkLogin: "Fazer Login",
    linkRegister: "Resgatar Oferta",
    terms: "Ao continuar, você concorda com os Termos de Uso e Política de Privacidade da Bíblia Sertaneja."
  },
  home: {
    // Dynamic Greeting Generator
    getGreeting: (faith: ChristianFaith | undefined, hour: number, userName?: string) => {
      const isCatholic = faith === 'catholic';
      const namePart = userName ? `, ${userName.split(' ')[0]}` : ''; // Get first name
      
      if (hour < 12) return isCatholic ? `Bom dia${namePart}` : `Bom dia${namePart}`;
      if (hour < 18) return `Boa tarde${namePart}`;
      return `Boa noite${namePart}`;
    },
    sections: {
      highlights: "Destaques",
      releases: "Lançamentos",
      recent: "Tocadas Recentemente",
      offline: "Seus Downloads"
    },
    // Dynamic Tips Generator
    getTips: (faith: ChristianFaith | undefined) => {
      const isCatholic = faith === 'catholic';

      return {
        playlist: {
          tag: "Dica",
          title: isCatholic ? "Playlist pra Missa" : "Playlist pro Culto",
          desc: isCatholic 
            ? "Organize os cânticos para a liturgia ou grupo de oração." 
            : "Crie sua playlist personalizada para o louvor ou célula.",
          mobileDesc: "Crie sua lista agora."
        },
        share: {
          tag: "Dica",
          title: "Envie no Zap",
          desc: isCatholic 
            ? "Compartilhe a música no grupo da Paróquia." 
            : "Compartilhe a música no grupo da Igreja.",
          mobileDesc: "Compartilhe no grupo."
        },
        offline: {
          tag: "Dica",
          title: isCatholic ? "Vai pro Retiro?" : "Vai pro Monte?",
          desc: "Baixe suas músicas favoritas para ouvir onde não tem sinal."
        }
      };
    }
  },
  sidebar: {
    menu: {
      home: "Início",
      search: "Buscar",
      library: "Sua Biblioteca",
      createPlaylist: "Criar Playlist", // New
      admin: "Admin / CMS"
    },
    offlineMode: "Modo Offline",
    loginCta: "Resgatar Premium Grátis",
    trialBadge: "Teste Grátis Ativo"
  },
  library: {
    title: "Sua Biblioteca",
    createPlaylist: "Criar Playlist",
    likedSongs: "Músicas Curtidas",
    likedSongsDesc: "Seus louvores favoritos em um só lugar.",
    empty: "Sua biblioteca está vazia."
  },
  search: {
    title: "O que você quer ouvir?",
    placeholder: "Busque por título, versículo ou tema...",
    button: "Buscar",
    offlineTitle: "Você está Offline",
    offlineDesc: "A busca funciona apenas na sua biblioteca local no modo offline. Vá para 'Sua Biblioteca' para ver o que você baixou.",
    noResults: "Nenhum louvor encontrado para",
    tryAgain: "Tente buscar pelo livro da Bíblia ou parte do título."
  },
  profile: {
    title: "Minha Conta",
    personalInfo: "Dados Pessoais",
    editProfile: "Editar Perfil",
    saveProfile: "Salvar Alterações",
    cancelEdit: "Cancelar",
    subscription: "Assinatura",
    plan: "Plano Atual",
    planFree: "Gratuito (Limitado)",
    planTrial: "Premium (Período de Teste)",
    planPremium: "Premium (Mensal)",
    validUntil: "Válido até",
    subscribeBtn: "Assinar Premium com Desconto",
    cancelBtn: "Cancelar Assinatura",
    logoutBtn: "Sair da Conta"
  },
  pricing: {
    title: "Escolha seu Plano",
    subtitle: "Apoie o projeto e tenha a melhor experiência.",
    monthly: "Mensal",
    annual: "Anual",
    saveLabel: "Economize 25%",
    fullPrice: "R$ 19,90",
    discountPrice: "R$ 12,90",
    annualPrice: "R$ 119,90",
    annualInstallment: "ou 12x de R$ 9,90",
    features: {
      fullAccess: "Acesso às músicas completas",
      offline: "Baixe músicas para ouvir offline",
      playlists: "Crie playlists ilimitadas",
      unlimited: "Pule quantas faixas quiser",
      sound: "Áudio em Alta Qualidade",
      support: "Apoie a missão Bíblia Sertaneja"
    },
    freeFeatures: {
      limited: "Acesso limitado ao catálogo",
      snippets: "Escute apenas trechos das músicas"
    },
    cta: "Quero Aproveitar o Desconto",
    secure: "Pagamento 100% Seguro via PIX ou Cartão"
  },
  upsell: {
    title: "Libere o Premium por 24h!",
    description: "Crie sua conta gratuita agora e ganhe acesso total: downloads, playlists ilimitadas e sem anúncios por um dia inteiro.",
    cta: "Criar Conta e Liberar Acesso",
    secondary: "Agora não",
    // New specific text for preview limits
    preview: {
      title: "Gostou do louvor?",
      description: "Você ouviu o trecho gratuito. Cadastre-se em 1 minuto para ouvir a música completa e ganhar 24h de Premium grátis.",
      cta: "Ouvir Música Completa"
    }
  }
};

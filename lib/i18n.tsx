"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

export type Lang = "ptBr" | "ptPt" | "en" | "es" | "fr"

const STORAGE_KEY = "findb-europa-lang"
const COOKIE_KEY = "findb-lang"

export const languages: { code: Lang; label: string; name: string }[] = [
  { code: "ptBr", label: "BR", name: "Português" },
  { code: "ptPt", label: "PT", name: "Português" },
  { code: "en", label: "EN", name: "English" },
  { code: "es", label: "ES", name: "Spanish" },
  { code: "fr", label: "FR", name: "France" },
]

const feedback = {
  campaignCreated: {
    pt: "Campanha cadastrada com sucesso.",
    en: "Campaign created successfully.",
    es: "Campaña creada correctamente.",
  },
  campaignUpdated: {
    pt: "Campanha atualizada com sucesso.",
    en: "Campaign updated successfully.",
    es: "Campaña actualizada correctamente.",
  },
  campaignDeleted: {
    pt: "Campanha excluída com sucesso.",
    en: "Campaign deleted successfully.",
    es: "Campaña eliminada correctamente.",
  },
  homeLinkCreated: {
    pt: "Link cadastrado com sucesso.",
    en: "Link created successfully.",
    es: "Enlace creado correctamente.",
  },
  homeLinkUpdated: {
    pt: "Link atualizado com sucesso.",
    en: "Link updated successfully.",
    es: "Enlace actualizado correctamente.",
  },
  homeLinkDeleted: {
    pt: "Link excluído com sucesso.",
    en: "Link deleted successfully.",
    es: "Enlace eliminado correctamente.",
  },
  homeLinkInvalid: {
    pt: "Preencha título, texto, URL e ordem.",
    en: "Fill in title, text, URL, and order.",
    es: "Completa título, texto, URL y orden.",
  },
  homeLinkInvalidIcon: {
    pt: "Ícone inválido.",
    en: "Invalid icon.",
    es: "Icono inválido.",
  },
  homeLinkInvalidTone: {
    pt: "Cor inválida.",
    en: "Invalid color.",
    es: "Color inválido.",
  },
  documentCreated: {
    pt: "Documento cadastrado com sucesso.",
    en: "Document created successfully.",
    es: "Documento creado correctamente.",
  },
  documentUpdated: {
    pt: "Documento atualizado com sucesso.",
    en: "Document updated successfully.",
    es: "Documento actualizado correctamente.",
  },
  documentDeleted: {
    pt: "Documento excluído com sucesso.",
    en: "Document deleted successfully.",
    es: "Documento eliminado correctamente.",
  },
  documentInvalid: {
    pt: "Preencha título, descrição e URL.",
    en: "Fill in title, description, and URL.",
    es: "Completa título, descripción y URL.",
  },
  documentInvalidType: {
    pt: "Tipo de documento inválido.",
    en: "Invalid document type.",
    es: "Tipo de documento inválido.",
  },
  campaignInvalid: {
    pt: "Preencha título, descrição, objetivo, material e recompensa.",
    en: "Fill in title, description, objective, material, and reward.",
    es: "Completa título, descripción, objetivo, material y recompensa.",
  },
  campaignRewardTooHigh: {
    pt: "A recompensa máxima é de 1.000.000 €.",
    en: "The maximum reward is €1,000,000.",
    es: "La recompensa máxima es de 1.000.000 €.",
  },
  invalidStatus: {
    pt: "Status inválido.",
    en: "Invalid status.",
    es: "Estado inválido.",
  },
  invalidStartDate: {
    pt: "A data de início não pode ser anterior a hoje.",
    en: "The start date cannot be before today.",
    es: "La fecha de inicio no puede ser anterior a hoy.",
  },
  invalidEndDate: {
    pt: "A data de fim não pode ser anterior ao início.",
    en: "The end date cannot be before the start date.",
    es: "La fecha de fin no puede ser anterior al inicio.",
  },
  campaignSaveError: {
    pt: "Não foi possível salvar a campanha.",
    en: "Could not save the campaign.",
    es: "No se pudo guardar la campaña.",
  },
  influencerStatusUpdated: {
    pt: "Status atualizado com sucesso.",
    en: "Status updated successfully.",
    es: "Estado actualizado correctamente.",
  },
  earningCreated: {
    pt: "Ganho lançado com sucesso.",
    en: "Earning added successfully.",
    es: "Ganancia registrada correctamente.",
  },
  earningDeleted: {
    pt: "Ganho excluído com sucesso.",
    en: "Earning deleted successfully.",
    es: "Ganancia eliminada correctamente.",
  },
  earningNotFound: {
    pt: "Ganho não encontrado.",
    en: "Earning not found.",
    es: "Ganancia no encontrada.",
  },
  earningInvalid: {
    pt: "Preencha influenciador, descrição e valor.",
    en: "Fill in influencer, description, and amount.",
    es: "Completa influencer, descripción y valor.",
  },
  invalidCredentials: {
    pt: "Credenciais inválidas.",
    en: "Invalid credentials.",
    es: "Credenciales inválidas.",
  },
  firstAdminExists: {
    pt: "O primeiro admin já foi configurado. Entre pelo login.",
    en: "The first admin has already been configured. Use the login page.",
    es: "El primer admin ya fue configurado. Entra por el login.",
  },
  fillAllFields: {
    pt: "Preencha todos os campos.",
    en: "Fill in all fields.",
    es: "Completa todos los campos.",
  },
  passwordTooShort: {
    pt: "Use uma senha com pelo menos 8 caracteres.",
    en: "Use a password with at least 8 characters.",
    es: "Usa una contraseña de al menos 8 caracteres.",
  },
  passwordsDoNotMatch: {
    pt: "As senhas não conferem.",
    en: "Passwords do not match.",
    es: "Las contraseñas no coinciden.",
  },
  influencerSignupError: {
    pt: "Não foi possível concluir o cadastro. Confira os campos e tente novamente.",
    en: "Could not complete registration. Check the fields and try again.",
    es: "No se pudo completar el registro. Revisa los campos e inténtalo de nuevo.",
  },
  influencerAlreadyExists: {
    pt: "Você já tem um cadastro no programa. Abrimos seu painel novamente.",
    en: "You already have a program registration. We reopened your dashboard.",
    es: "Ya tienes un registro en el programa. Abrimos tu panel nuevamente.",
  },
  influencerSignupSuccess: {
    pt: "Cadastro recebido. Seu painel já está pronto enquanto a equipe avalia sua aprovação.",
    en: "Registration received. Your dashboard is ready while the team reviews your approval.",
    es: "Registro recibido. Tu panel ya está listo mientras el equipo revisa tu aprobación.",
  },
  influencerLoginRequired: {
    pt: "Informe email e WhatsApp para acessar sua área.",
    en: "Enter email and WhatsApp to access your area.",
    es: "Informa email y WhatsApp para acceder a tu área.",
  },
  influencerLoginEmailRequired: {
    pt: "Informe o email cadastrado para receber o código.",
    en: "Enter your registered email to receive the code.",
    es: "Informa el email registrado para recibir el código.",
  },
  influencerLoginNotFound: {
    pt: "Não encontramos cadastro com esses dados.",
    en: "We could not find a registration with those details.",
    es: "No encontramos un registro con esos datos.",
  },
  influencerLoginPendingApproval: {
    pt: "Seu cadastro ainda está aguardando aprovação. Você poderá acessar após a aprovação da equipe.",
    en: "Your registration is still pending approval. You will be able to access it after the team approves it.",
    es: "Tu registro aún está pendiente de aprobación. Podrás acceder después de la aprobación del equipo.",
  },
  influencerLoginCodeSent: {
    pt: "Enviamos um código para seu email cadastrado.",
    en: "We sent a code to your registered email.",
    es: "Enviamos un código a tu email registrado.",
  },
  influencerLoginCodeDevSent: {
    pt: "Código gerado. Configure o SMTP para enviar por email.",
    en: "Code generated. Configure SMTP to send it by email.",
    es: "Código generado. Configura SMTP para enviarlo por email.",
  },
  influencerLoginCodeSendError: {
    pt: "Não foi possível enviar o código. Tente novamente.",
    en: "Could not send the code. Please try again.",
    es: "No se pudo enviar el código. Inténtalo de nuevo.",
  },
  influencerLoginCodeRecentlySent: {
    pt: "Já enviamos um código agora há pouco. Aguarde um minuto para reenviar.",
    en: "We just sent a code. Wait one minute before resending.",
    es: "Ya enviamos un código hace poco. Espera un minuto para reenviar.",
  },
  influencerLoginCodeRequired: {
    pt: "Informe o código de 6 caracteres.",
    en: "Enter the 6-character code.",
    es: "Informa el código de 6 caracteres.",
  },
  influencerLoginCodeInvalid: {
    pt: "Código inválido. Confira e tente novamente.",
    en: "Invalid code. Check it and try again.",
    es: "Código inválido. Revísalo e inténtalo de nuevo.",
  },
  influencerLoginCodeExpired: {
    pt: "Código expirado. Solicite um novo código.",
    en: "Code expired. Request a new code.",
    es: "Código expirado. Solicita un nuevo código.",
  },
  influencerLoginCodeBlocked: {
    pt: "Muitas tentativas. Solicite um novo código.",
    en: "Too many attempts. Request a new code.",
    es: "Demasiados intentos. Solicita un nuevo código.",
  },
} as const

export type FeedbackKey = keyof typeof feedback

export const translations = {
  pt: {
    header: {
      openMenu: "Abrir menu",
      closeMenu: "Fechar menu",
      language: "Selecionar idioma",
      login: "Entrar",
    },
    hero: {
      community: "Comunidades brasileiras na Europa.",
      join: "Junte-se a nós.",
      tagline: "Construindo relacionamentos saudáveis.",
    },
    links: {
      influenciadores: ["Influenciadores Imigrantes", "Divulgue a bio e ganhe em euros"],
      paises: ["Escolha seu país europeu", "Encontre comunidades no seu país"],
      grupos: ["Entrar nos grupos", "Comunidades e fóruns"],
      parceiro: ["Seja um parceiro ou afiliado FindB", "Parcerias que conectam"],
      indicacoes: ["Indicações", "Empregos, Moradias e muito mais."],
      whatsapp: ["Traga seu grupo de WhatsApp", "ou crie sua comunidade"],
      networking: ["Networking", "Empresas e projetos"],
      eventos: ["Participe de eventos presenciais", "Encontros que transformam"],
      viagens: ["Passagens aéreas, hospedagens,", "viagens e turismo"],
      cartao: ["Adquirir seu cartão de membro", "Benefícios exclusivos"],
    },
    stats: {
      paises: ["+30", "Países europeus"],
      membros: ["Milhares", "de membros"],
      empregos: ["Empregos e", "oportunidades"],
      moradias: ["Moradias", "e acessos"],
      networking: ["Networking", "e parcerias"],
      eventos: ["Eventos", "presenciais"],
    },
    flags: {
      title: "Todos os países.",
      accent: "Uma só comunidade.",
    },
    influencerProgram: {
      eyebrow: "Programa oficial.",
      accent: "Ganhe em euros.",
      title: "Influenciadores Imigrantes",
      description: "Divulgue a FindB Europa, receba seu link exclusivo e acompanhe campanhas para ganhar em euros.",
      cta: "Quero ganhar em euros",
      highlights: [
        "Divulgue a bio da FindB Europa no seu perfil",
        "Marque a FindB Europa nas publicações",
        "Veja campanhas e regras oficiais na comunidade",
      ],
      disclaimer: "A participação está sujeita à aprovação da FindB Europa, aos Termos de Uso e às regras de cada campanha.",
    },
    footer: {
      follow: "Siga nossas redes",
      learnMore: "Saiba mais",
      site: "comunidadesfindbeuropa.com",
      connected: "Conectando brasileiros,",
      stories: "unindo histórias",
    },
    feedback: Object.fromEntries(
      Object.entries(feedback).map(([key, value]) => [key, value.pt]),
    ) as Record<FeedbackKey, string>,
  },
  en: {
    header: {
      openMenu: "Open menu",
      closeMenu: "Close menu",
      language: "Select language",
      login: "Login",
    },
    hero: {
      community: "Brazilian communities in Europe.",
      join: "Join us.",
      tagline: "Building healthy relationships.",
    },
    links: {
      influenciadores: ["Immigrant Influencers", "Share the bio and earn in euros"],
      paises: ["Choose your European country", "Find communities in your country"],
      grupos: ["Join the groups", "Communities and forums"],
      parceiro: ["Become a FindB partner or affiliate", "Partnerships that connect"],
      indicacoes: ["Recommendations", "Jobs, Housing and much more."],
      whatsapp: ["Bring your WhatsApp group", "or create your community"],
      networking: ["Networking", "Companies and projects"],
      eventos: ["Join in-person events", "Meetups that transform"],
      viagens: ["Flights, stays,", "travel and tourism"],
      cartao: ["Get your member card", "Exclusive benefits"],
    },
    stats: {
      paises: ["+30", "European countries"],
      membros: ["Thousands", "of members"],
      empregos: ["Jobs and", "opportunities"],
      moradias: ["Housing", "and access"],
      networking: ["Networking", "and partners"],
      eventos: ["In-person", "events"],
    },
    flags: {
      title: "All countries.",
      accent: "One community.",
    },
    influencerProgram: {
      eyebrow: "Official program.",
      accent: "Earn in euros.",
      title: "Immigrant Influencers",
      description: "Share FindB Europa, receive your exclusive link, and follow campaigns to earn in euros.",
      cta: "I want to earn in euros",
      highlights: [
        "Share the FindB Europa bio on your profile",
        "Tag FindB Europa in your posts",
        "See official campaigns and rules in the community",
      ],
      disclaimer: "Participation is subject to FindB Europa approval, Terms of Use, and each campaign's rules.",
    },
    footer: {
      follow: "Follow our socials",
      learnMore: "Learn more",
      site: "comunidadesfindbeuropa.com",
      connected: "Connecting Brazilians,",
      stories: "uniting stories",
    },
    feedback: Object.fromEntries(
      Object.entries(feedback).map(([key, value]) => [key, value.en]),
    ) as Record<FeedbackKey, string>,
  },
  es: {
    header: {
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
      language: "Seleccionar idioma",
      login: "Entrar",
    },
    hero: {
      community: "Comunidades brasileñas en Europa.",
      join: "Únete a nosotros.",
      tagline: "Construyendo relaciones saludables.",
    },
    links: {
      influenciadores: ["Influencers Inmigrantes", "Comparte la bio y gana en euros"],
      paises: ["Elige tu país europeo", "Encuentra comunidades en tu país"],
      grupos: ["Entrar en los grupos", "Comunidades y foros"],
      parceiro: ["Sé socio o afiliado FindB", "Alianzas que conectan"],
      indicacoes: ["Indicaciones", "Empleos, Viviendas y mucho más."],
      whatsapp: ["Trae tu grupo de WhatsApp", "o crea tu comunidad"],
      networking: ["Networking", "Empresas y proyectos"],
      eventos: ["Participa en eventos presenciales", "Encuentros que transforman"],
      viagens: ["Vuelos, hospedajes,", "viajes y turismo"],
      cartao: ["Adquiere tu tarjeta de miembro", "Beneficios exclusivos"],
    },
    stats: {
      paises: ["+30", "Países europeos"],
      membros: ["Miles", "de miembros"],
      empregos: ["Empleos y", "oportunidades"],
      moradias: ["Viviendas", "y accesos"],
      networking: ["Networking", "y alianzas"],
      eventos: ["Eventos", "presenciales"],
    },
    flags: {
      title: "Todos los países.",
      accent: "Una sola comunidad.",
    },
    influencerProgram: {
      eyebrow: "Programa oficial.",
      accent: "Gana en euros.",
      title: "Influencers Inmigrantes",
      description: "Comparte FindB Europa, recibe tu enlace exclusivo y acompaña campañas para ganar en euros.",
      cta: "Quiero ganar en euros",
      highlights: [
        "Comparte la bio de FindB Europa en tu perfil",
        "Etiqueta a FindB Europa en tus publicaciones",
        "Consulta campañas y reglas oficiales en la comunidad",
      ],
      disclaimer: "La participación está sujeta a la aprobación de FindB Europa, a los Términos de Uso y a las reglas de cada campaña.",
    },
    footer: {
      follow: "Sigue nuestras redes",
      learnMore: "Saber más",
      site: "comunidadesfindbeuropa.com",
      connected: "Conectando brasileños,",
      stories: "uniendo historias",
    },
    feedback: Object.fromEntries(
      Object.entries(feedback).map(([key, value]) => [key, value.es]),
    ) as Record<FeedbackKey, string>,
  },
} as const

type Messages = {
  header: Record<keyof typeof translations.pt.header, string>
  hero: Record<keyof typeof translations.pt.hero, string>
  links: { [Key in keyof typeof translations.pt.links]: readonly [string, string] }
  stats: { [Key in keyof typeof translations.pt.stats]: readonly [string, string] }
  flags: Record<keyof typeof translations.pt.flags, string>
  influencerProgram: {
    eyebrow: string
    accent: string
    title: string
    description: string
    cta: string
    highlights: readonly string[]
    disclaimer: string
  }
  footer: Record<keyof typeof translations.pt.footer, string>
  feedback: Record<FeedbackKey, string>
}

const ptPtMessages: Messages = {
  header: {
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    language: "Selecionar idioma",
    login: "Entrar",
  },
  hero: {
    community: "Comunidades brasileiras na Europa.",
    join: "Junte-se a nós.",
    tagline: "A construir relações saudáveis.",
  },
  links: {
    influenciadores: ["Influenciadores Imigrantes", "Divulgue a bio e ganhe em euros"],
    paises: ["Escolha o seu país europeu", "Encontre comunidades no seu país"],
    grupos: ["Entrar nos grupos", "Comunidades e fóruns"],
    parceiro: ["Seja parceiro ou afiliado FindB", "Parcerias que aproximam"],
    indicacoes: ["Indicações", "Emprego, habitação e muito mais."],
    whatsapp: ["Traga o seu grupo de WhatsApp", "ou crie a sua comunidade"],
    networking: ["Networking", "Empresas e projetos"],
    eventos: ["Participe em eventos presenciais", "Encontros que transformam"],
    viagens: ["Passagens aéreas, estadias,", "viagens e turismo"],
    cartao: ["Adquira o seu cartão de membro", "Benefícios exclusivos"],
  },
  stats: {
    paises: ["+30", "Países europeus"],
    membros: ["Milhares", "de membros"],
    empregos: ["Emprego e", "oportunidades"],
    moradias: ["Habitação", "e acessos"],
    networking: ["Networking", "e parcerias"],
    eventos: ["Eventos", "presenciais"],
  },
  flags: {
    title: "Todos os países.",
    accent: "Uma só comunidade.",
  },
  influencerProgram: {
    eyebrow: "Programa oficial.",
    accent: "Ganhe em euros.",
    title: "Influenciadores Imigrantes",
    description: "Divulgue a FindB Europa, receba o seu link exclusivo e acompanhe campanhas para ganhar em euros.",
    cta: "Quero ganhar em euros",
    highlights: [
      "Divulgue a bio da FindB Europa no seu perfil",
      "Marque a FindB Europa nas publicações",
      "Veja campanhas e regras oficiais na comunidade",
    ],
    disclaimer: "A participação está sujeita à aprovação da FindB Europa, aos Termos de Utilização e às regras de cada campanha.",
  },
  footer: {
    follow: "Siga as nossas redes",
    learnMore: "Saiba mais",
    site: "comunidadesfindbeuropa.com",
    connected: "A ligar brasileiros,",
    stories: "a unir histórias",
  },
  feedback: {
    campaignCreated: "Campanha criada com sucesso.",
    campaignUpdated: "Campanha atualizada com sucesso.",
    campaignDeleted: "Campanha eliminada com sucesso.",
    homeLinkCreated: "Link criado com sucesso.",
    homeLinkUpdated: "Link atualizado com sucesso.",
    homeLinkDeleted: "Link eliminado com sucesso.",
    homeLinkInvalid: "Preencha título, texto, URL e ordem.",
    homeLinkInvalidIcon: "Ícone inválido.",
    homeLinkInvalidTone: "Cor inválida.",
    documentCreated: "Documento criado com sucesso.",
    documentUpdated: "Documento atualizado com sucesso.",
    documentDeleted: "Documento eliminado com sucesso.",
    documentInvalid: "Preencha título, descrição e URL.",
    documentInvalidType: "Tipo de documento inválido.",
    campaignInvalid: "Preencha título, descrição, objetivo, material e recompensa.",
    campaignRewardTooHigh: "A recompensa máxima é de 1.000.000 €.",
    invalidStatus: "Estado inválido.",
    invalidStartDate: "A data de início não pode ser anterior a hoje.",
    invalidEndDate: "A data de fim não pode ser anterior ao início.",
    campaignSaveError: "Não foi possível guardar a campanha.",
    influencerStatusUpdated: "Estado atualizado com sucesso.",
    earningCreated: "Ganho lançado com sucesso.",
    earningDeleted: "Ganho eliminado com sucesso.",
    earningNotFound: "Ganho não encontrado.",
    earningInvalid: "Preencha influenciador, descrição e valor.",
    invalidCredentials: "Credenciais inválidas.",
    firstAdminExists: "O primeiro admin já foi configurado. Entre pelo login.",
    fillAllFields: "Preencha todos os campos.",
    passwordTooShort: "Use uma palavra-passe com pelo menos 8 caracteres.",
    passwordsDoNotMatch: "As palavras-passe não coincidem.",
    influencerSignupError: "Não foi possível concluir o registo. Verifique os campos e tente novamente.",
    influencerAlreadyExists: "Já tem um registo no programa. Abrimos novamente o seu painel.",
    influencerSignupSuccess: "Registo recebido. O seu painel já está pronto enquanto a equipa avalia a aprovação.",
    influencerLoginRequired: "Informe email e WhatsApp para aceder à sua área.",
    influencerLoginEmailRequired: "Informe o email registado para receber o código.",
    influencerLoginNotFound: "Não encontrámos um registo com esses dados.",
    influencerLoginPendingApproval: "O seu registo ainda aguarda aprovação. Poderá aceder após a aprovação da equipa.",
    influencerLoginCodeSent: "Enviámos um código para o seu email registado.",
    influencerLoginCodeDevSent: "Código gerado. Configure o SMTP para enviar por email.",
    influencerLoginCodeSendError: "Não foi possível enviar o código. Tente novamente.",
    influencerLoginCodeRecentlySent: "Já enviámos um código há pouco. Aguarde um minuto para reenviar.",
    influencerLoginCodeRequired: "Informe o código de 6 caracteres.",
    influencerLoginCodeInvalid: "Código inválido. Verifique e tente novamente.",
    influencerLoginCodeExpired: "Código expirado. Solicite um novo código.",
    influencerLoginCodeBlocked: "Demasiadas tentativas. Solicite um novo código.",
  },
}

const frMessages: Messages = {
  header: {
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    language: "Sélectionner la langue",
    login: "Connexion",
  },
  hero: {
    community: "Communautés brésiliennes en Europe.",
    join: "Rejoignez-nous.",
    tagline: "Construire des relations saines.",
  },
  links: {
    influenciadores: ["Influenceurs immigrants", "Partagez la bio et gagnez en euros"],
    paises: ["Choisissez votre pays européen", "Trouvez des communautés dans votre pays"],
    grupos: ["Rejoindre les groupes", "Communautés et forums"],
    parceiro: ["Devenez partenaire ou affilié FindB", "Des partenariats qui connectent"],
    indicacoes: ["Indications", "Emplois, logements et bien plus."],
    whatsapp: ["Ajoutez votre groupe WhatsApp", "ou créez votre communauté"],
    networking: ["Networking", "Entreprises et projets"],
    eventos: ["Participez aux événements en présentiel", "Des rencontres qui transforment"],
    viagens: ["Billets d’avion, hébergements,", "voyages et tourisme"],
    cartao: ["Obtenez votre carte de membre", "Avantages exclusifs"],
  },
  stats: {
    paises: ["+30", "Pays européens"],
    membros: ["Des milliers", "de membres"],
    empregos: ["Emplois et", "opportunités"],
    moradias: ["Logements", "et accès"],
    networking: ["Networking", "et partenariats"],
    eventos: ["Événements", "en présentiel"],
  },
  flags: {
    title: "Tous les pays.",
    accent: "Une seule communauté.",
  },
  influencerProgram: {
    eyebrow: "Programme officiel.",
    accent: "Gagnez en euros.",
    title: "Influenceurs immigrants",
    description: "Partagez FindB Europa, recevez votre lien exclusif et suivez les campagnes pour gagner en euros.",
    cta: "Je veux gagner en euros",
    highlights: [
      "Partagez la bio de FindB Europa sur votre profil",
      "Identifiez FindB Europa dans vos publications",
      "Consultez les campagnes et règles officielles dans la communauté",
    ],
    disclaimer: "La participation est soumise à l’approbation de FindB Europa, aux Conditions d’utilisation et aux règles de chaque campagne.",
  },
  footer: {
    follow: "Suivez nos réseaux",
    learnMore: "En savoir plus",
    site: "comunidadesfindbeuropa.com",
    connected: "Connecter les Brésiliens,",
    stories: "unir les histoires",
  },
  feedback: {
    campaignCreated: "Campagne créée avec succès.",
    campaignUpdated: "Campagne mise à jour avec succès.",
    campaignDeleted: "Campagne supprimée avec succès.",
    homeLinkCreated: "Lien créé avec succès.",
    homeLinkUpdated: "Lien mis à jour avec succès.",
    homeLinkDeleted: "Lien supprimé avec succès.",
    homeLinkInvalid: "Renseignez le titre, le texte, l’URL et l’ordre.",
    homeLinkInvalidIcon: "Icône invalide.",
    homeLinkInvalidTone: "Couleur invalide.",
    documentCreated: "Document créé avec succès.",
    documentUpdated: "Document mis à jour avec succès.",
    documentDeleted: "Document supprimé avec succès.",
    documentInvalid: "Renseignez le titre, la description et l’URL.",
    documentInvalidType: "Type de document invalide.",
    campaignInvalid: "Renseignez le titre, la description, l’objectif, le support et la récompense.",
    campaignRewardTooHigh: "La récompense maximale est de 1 000 000 €.",
    invalidStatus: "Statut invalide.",
    invalidStartDate: "La date de début ne peut pas être antérieure à aujourd’hui.",
    invalidEndDate: "La date de fin ne peut pas être antérieure à la date de début.",
    campaignSaveError: "Impossible d’enregistrer la campagne.",
    influencerStatusUpdated: "Statut mis à jour avec succès.",
    earningCreated: "Gain ajouté avec succès.",
    earningDeleted: "Gain supprimé avec succès.",
    earningNotFound: "Gain introuvable.",
    earningInvalid: "Renseignez l’influenceur, la description et le montant.",
    invalidCredentials: "Identifiants invalides.",
    firstAdminExists: "Le premier admin est déjà configuré. Connectez-vous depuis la page de connexion.",
    fillAllFields: "Renseignez tous les champs.",
    passwordTooShort: "Utilisez un mot de passe d’au moins 8 caractères.",
    passwordsDoNotMatch: "Les mots de passe ne correspondent pas.",
    influencerSignupError: "Impossible de terminer l’inscription. Vérifiez les champs et réessayez.",
    influencerAlreadyExists: "Vous avez déjà une inscription au programme. Nous avons rouvert votre tableau de bord.",
    influencerSignupSuccess: "Inscription reçue. Votre tableau de bord est prêt pendant que l’équipe examine votre approbation.",
    influencerLoginRequired: "Indiquez l’email et le WhatsApp pour accéder à votre espace.",
    influencerLoginEmailRequired: "Indiquez l’email inscrit pour recevoir le code.",
    influencerLoginNotFound: "Nous n’avons trouvé aucune inscription avec ces données.",
    influencerLoginPendingApproval: "Votre inscription est encore en attente d’approbation. Vous pourrez accéder après l’approbation de l’équipe.",
    influencerLoginCodeSent: "Nous avons envoyé un code à votre email inscrit.",
    influencerLoginCodeDevSent: "Code généré. Configurez SMTP pour l’envoyer par email.",
    influencerLoginCodeSendError: "Impossible d’envoyer le code. Réessayez.",
    influencerLoginCodeRecentlySent: "Nous venons déjà d’envoyer un code. Attendez une minute avant de renvoyer.",
    influencerLoginCodeRequired: "Indiquez le code à 6 caractères.",
    influencerLoginCodeInvalid: "Code invalide. Vérifiez et réessayez.",
    influencerLoginCodeExpired: "Code expiré. Demandez un nouveau code.",
    influencerLoginCodeBlocked: "Trop de tentatives. Demandez un nouveau code.",
  },
}

const translationsByLang: Record<Lang, Messages> = {
  ptBr: translations.pt,
  ptPt: ptPtMessages,
  en: translations.en,
  es: translations.es,
  fr: frMessages,
}

type I18nContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Messages
}

const I18nContext = createContext<I18nContextValue | null>(null)

function readCookieLang(): Lang | null {
  if (typeof document === "undefined") {
    return null
  }

  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${COOKIE_KEY}=`))
    ?.split("=")[1]

  return normalizeLang(cookie)
}

function isLang(value: unknown): value is Lang {
  return value === "ptBr" || value === "ptPt" || value === "en" || value === "es" || value === "fr"
}

function normalizeLang(value: unknown): Lang | null {
  if (isLang(value)) {
    return value
  }

  if (value === "pt" || value === "pt-BR") {
    return "ptBr"
  }

  if (value === "pt-PT") {
    return "ptPt"
  }

  return null
}

function getHtmlLang(value: Lang) {
  const htmlLangByCode: Record<Lang, string> = {
    ptBr: "pt-BR",
    ptPt: "pt-PT",
    en: "en",
    es: "es",
    fr: "fr",
  }

  return htmlLangByCode[value]
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ptBr")

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    const nextLang = normalizeLang(saved) ?? readCookieLang()

    if (nextLang) {
      setLangState(nextLang)
    }
  }, [])

  function setLang(nextLang: Lang) {
    setLangState(nextLang)
    window.localStorage.setItem(STORAGE_KEY, nextLang)
    document.cookie = `${COOKIE_KEY}=${nextLang}; path=/; max-age=31536000; SameSite=Lax`
    document.documentElement.lang = getHtmlLang(nextLang)
  }

  useEffect(() => {
    document.documentElement.lang = getHtmlLang(lang)
  }, [lang])

  const value = useMemo<I18nContextValue>(
    () => ({
      lang,
      setLang,
      t: translationsByLang[lang],
    }),
    [lang],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider")
  }

  return context
}

export function translateFeedback(t: Pick<Messages, "feedback">, message?: string) {
  if (!message) {
    return ""
  }

  return message in t.feedback ? t.feedback[message as FeedbackKey] : message
}

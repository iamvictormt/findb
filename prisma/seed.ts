import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const homeLinks = [
    {
      title: "Influenciadores Imigrantes",
      subtitle: "Divulgue a bio e ganhe em euros",
      titlePtPt: "Influenciadores Imigrantes",
      subtitlePtPt: "Divulgue a bio e ganhe em euros",
      titleEn: "Immigrant Influencers",
      subtitleEn: "Share the bio and earn in euros",
      titleEs: "Influencers Inmigrantes",
      subtitleEs: "Comparte la bio y gana en euros",
      titleFr: "Influenceurs immigrants",
      subtitleFr: "Partagez la bio et gagnez en euros",
      href: "/influenciadores",
      icon: "BadgeEuro",
      tone: "gold",
      sortOrder: 10,
    },
    {
      title: "Escolha seu país europeu",
      subtitle: "Encontre comunidades no seu país",
      titlePtPt: "Escolha o seu país europeu",
      subtitlePtPt: "Encontre comunidades no seu país",
      titleEn: "Choose your European country",
      subtitleEn: "Find communities in your country",
      titleEs: "Elige tu país europeo",
      subtitleEs: "Encuentra comunidades en tu país",
      titleFr: "Choisissez votre pays européen",
      subtitleFr: "Trouvez des communautés dans votre pays",
      href: "#bandeiras",
      icon: "Globe2",
      tone: "blue",
      sortOrder: 20,
    },
    {
      title: "Entrar nos grupos",
      subtitle: "Comunidades e fóruns",
      titlePtPt: "Entrar nos grupos",
      subtitlePtPt: "Comunidades e fóruns",
      titleEn: "Join the groups",
      subtitleEn: "Communities and forums",
      titleEs: "Entrar en los grupos",
      subtitleEs: "Comunidades y foros",
      titleFr: "Rejoindre les groupes",
      subtitleFr: "Communautés et forums",
      href: "https://wa.me/",
      icon: "UsersRound",
      tone: "pink",
      sortOrder: 30,
    },
    {
      title: "Adquirir seu cartão de membro",
      subtitle: "Benefícios exclusivos",
      titlePtPt: "Adquira o seu cartão de membro",
      subtitlePtPt: "Benefícios exclusivos",
      titleEn: "Get your member card",
      subtitleEn: "Exclusive benefits",
      titleEs: "Adquiere tu tarjeta de miembro",
      subtitleEs: "Beneficios exclusivos",
      titleFr: "Obtenez votre carte de membre",
      subtitleFr: "Avantages exclusifs",
      href: "#cartoes",
      icon: "CreditCard",
      tone: "blue",
      sortOrder: 40,
    },
    {
      title: "Seja um parceiro ou afiliado FindB",
      subtitle: "Parcerias que conectam",
      titlePtPt: "Seja parceiro ou afiliado FindB",
      subtitlePtPt: "Parcerias que aproximam",
      titleEn: "Become a FindB partner or affiliate",
      subtitleEn: "Partnerships that connect",
      titleEs: "Sé socio o afiliado FindB",
      subtitleEs: "Alianzas que conectan",
      titleFr: "Devenez partenaire ou affilié FindB",
      subtitleFr: "Des partenariats qui connectent",
      href: "#",
      icon: "Handshake",
      tone: "pink",
      sortOrder: 50,
    },
    {
      title: "Indicações",
      subtitle: "Empregos, Moradias e muito mais.",
      titlePtPt: "Indicações",
      subtitlePtPt: "Emprego, habitação e muito mais.",
      titleEn: "Recommendations",
      subtitleEn: "Jobs, Housing and much more.",
      titleEs: "Indicaciones",
      subtitleEs: "Empleos, Viviendas y mucho más.",
      titleFr: "Indications",
      subtitleFr: "Emplois, logements et bien plus.",
      href: "#",
      icon: "BriefcaseBusiness",
      tone: "blue",
      sortOrder: 60,
    },
  ]

  for (const link of homeLinks) {
    const existing = await prisma.homeLink.findFirst({ where: { title: link.title } })

    if (!existing) {
      await prisma.homeLink.create({ data: link })
    }
  }

  const campaigns = [
    {
      title: "Stories marcando a FindB Europa",
      description: "Publique uma sequência de stories usando os materiais oficiais e marque o perfil da FindB Europa.",
      objective: "Gerar alcance qualificado entre brasileiros e imigrantes na Europa.",
      rewardCents: 1500,
      materialType: "Stories",
    },
    {
      title: "Reels de boas-vindas",
      description: "Crie um Reel explicando como a comunidade ajuda com moradia, emprego e networking.",
      objective: "Converter novos cadastros para a plataforma.",
      rewardCents: 3500,
      materialType: "Reels",
    },
    {
      title: "Convite para grupos por país",
      description: "Compartilhe seu link exclusivo em grupos e comunidades de imigrantes.",
      objective: "Aumentar novos membros por país europeu.",
      rewardCents: 800,
      materialType: "Link",
    },
  ]

  for (const campaign of campaigns) {
    const existing = await prisma.campaign.findFirst({ where: { title: campaign.title } })

    if (!existing) {
      await prisma.campaign.create({ data: campaign })
    }
  }

  const assets = [
    {
      title: "Kit de Stories FindB Europa",
      type: "STORY",
      description: "Artes verticais com chamada para cadastro e link exclusivo.",
      url: "/influenciadores/materiais/stories",
    },
    {
      title: "Roteiro para Reels",
      type: "SCRIPT",
      description: "Texto pronto para apresentar a FindB Europa em ate 30 segundos.",
      url: "/influenciadores/materiais/roteiro-reels",
    },
    {
      title: "Logotipos oficiais",
      type: "BRAND",
      description: "Arquivos de marca para publicações aprovadas.",
      url: "/influenciadores/materiais/logos",
    },
  ]

  for (const asset of assets) {
    const existing = await prisma.contentAsset.findFirst({ where: { title: asset.title } })

    if (!existing) {
      await prisma.contentAsset.create({ data: asset })
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })

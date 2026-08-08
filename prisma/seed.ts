import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
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

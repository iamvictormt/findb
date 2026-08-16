ALTER TABLE "HomeLink"
  ADD COLUMN "titlePtPt" TEXT,
  ADD COLUMN "subtitlePtPt" TEXT,
  ADD COLUMN "titleEn" TEXT,
  ADD COLUMN "subtitleEn" TEXT,
  ADD COLUMN "titleEs" TEXT,
  ADD COLUMN "subtitleEs" TEXT,
  ADD COLUMN "titleFr" TEXT,
  ADD COLUMN "subtitleFr" TEXT;

UPDATE "HomeLink"
SET
  "titlePtPt" = CASE "title"
    WHEN 'Influenciadores Imigrantes' THEN 'Influenciadores Imigrantes'
    WHEN 'Escolha seu país europeu' THEN 'Escolha o seu país europeu'
    WHEN 'Entrar nos grupos' THEN 'Entrar nos grupos'
    WHEN 'Adquirir seu cartão de membro' THEN 'Adquira o seu cartão de membro'
    WHEN 'Seja um parceiro ou afiliado FindB' THEN 'Seja parceiro ou afiliado FindB'
    WHEN 'Indicações' THEN 'Indicações'
    ELSE "titlePtPt"
  END,
  "subtitlePtPt" = CASE "title"
    WHEN 'Influenciadores Imigrantes' THEN 'Divulgue a bio e ganhe em euros'
    WHEN 'Escolha seu país europeu' THEN 'Encontre comunidades no seu país'
    WHEN 'Entrar nos grupos' THEN 'Comunidades e fóruns'
    WHEN 'Adquirir seu cartão de membro' THEN 'Benefícios exclusivos'
    WHEN 'Seja um parceiro ou afiliado FindB' THEN 'Parcerias que aproximam'
    WHEN 'Indicações' THEN 'Emprego, habitação e muito mais.'
    ELSE "subtitlePtPt"
  END,
  "titleEn" = CASE "title"
    WHEN 'Influenciadores Imigrantes' THEN 'Immigrant Influencers'
    WHEN 'Escolha seu país europeu' THEN 'Choose your European country'
    WHEN 'Entrar nos grupos' THEN 'Join the groups'
    WHEN 'Adquirir seu cartão de membro' THEN 'Get your member card'
    WHEN 'Seja um parceiro ou afiliado FindB' THEN 'Become a FindB partner or affiliate'
    WHEN 'Indicações' THEN 'Recommendations'
    ELSE "titleEn"
  END,
  "subtitleEn" = CASE "title"
    WHEN 'Influenciadores Imigrantes' THEN 'Share the bio and earn in euros'
    WHEN 'Escolha seu país europeu' THEN 'Find communities in your country'
    WHEN 'Entrar nos grupos' THEN 'Communities and forums'
    WHEN 'Adquirir seu cartão de membro' THEN 'Exclusive benefits'
    WHEN 'Seja um parceiro ou afiliado FindB' THEN 'Partnerships that connect'
    WHEN 'Indicações' THEN 'Jobs, Housing and much more.'
    ELSE "subtitleEn"
  END,
  "titleEs" = CASE "title"
    WHEN 'Influenciadores Imigrantes' THEN 'Influencers Inmigrantes'
    WHEN 'Escolha seu país europeu' THEN 'Elige tu país europeo'
    WHEN 'Entrar nos grupos' THEN 'Entrar en los grupos'
    WHEN 'Adquirir seu cartão de membro' THEN 'Adquiere tu tarjeta de miembro'
    WHEN 'Seja um parceiro ou afiliado FindB' THEN 'Sé socio o afiliado FindB'
    WHEN 'Indicações' THEN 'Indicaciones'
    ELSE "titleEs"
  END,
  "subtitleEs" = CASE "title"
    WHEN 'Influenciadores Imigrantes' THEN 'Comparte la bio y gana en euros'
    WHEN 'Escolha seu país europeu' THEN 'Encuentra comunidades en tu país'
    WHEN 'Entrar nos grupos' THEN 'Comunidades y foros'
    WHEN 'Adquirir seu cartão de membro' THEN 'Beneficios exclusivos'
    WHEN 'Seja um parceiro ou afiliado FindB' THEN 'Alianzas que conectan'
    WHEN 'Indicações' THEN 'Empleos, Viviendas y mucho más.'
    ELSE "subtitleEs"
  END,
  "titleFr" = CASE "title"
    WHEN 'Influenciadores Imigrantes' THEN 'Influenceurs immigrants'
    WHEN 'Escolha seu país europeu' THEN 'Choisissez votre pays européen'
    WHEN 'Entrar nos grupos' THEN 'Rejoindre les groupes'
    WHEN 'Adquirir seu cartão de membro' THEN 'Obtenez votre carte de membre'
    WHEN 'Seja um parceiro ou afiliado FindB' THEN 'Devenez partenaire ou affilié FindB'
    WHEN 'Indicações' THEN 'Indications'
    ELSE "titleFr"
  END,
  "subtitleFr" = CASE "title"
    WHEN 'Influenciadores Imigrantes' THEN 'Partagez la bio et gagnez en euros'
    WHEN 'Escolha seu país europeu' THEN 'Trouvez des communautés dans votre pays'
    WHEN 'Entrar nos grupos' THEN 'Communautés et forums'
    WHEN 'Adquirir seu cartão de membro' THEN 'Avantages exclusifs'
    WHEN 'Seja um parceiro ou afiliado FindB' THEN 'Des partenariats qui connectent'
    WHEN 'Indicações' THEN 'Emplois, logements et bien plus.'
    ELSE "subtitleFr"
  END
WHERE "title" IN (
  'Influenciadores Imigrantes',
  'Escolha seu país europeu',
  'Entrar nos grupos',
  'Adquirir seu cartão de membro',
  'Seja um parceiro ou afiliado FindB',
  'Indicações'
);

import {
  PrismaClient,
  CollaboratorStatus,
  CollaboratorType,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Categories
  await prisma.categories.createMany({
    data: [
      { name: 'Lanches', description: '' },
      { name: 'Bebidas', description: '' },
      { name: 'Sobremesas', description: '' },
    ],
    skipDuplicates: true,
  });

  // create Products
  await prisma.product.createMany({
    data: [
      {
        name: 'hambúrguer com batata frita',
        category_id: 1,
        description: 'hambúrguer com batata frita',
        amount: 0.1,
        url_img:
          'https://media.istockphoto.com/id/495204032/pt/foto/frescos-hamb%C3%BArguer-saboroso.jpg?s=612x612&w=0&k=20&c=JhqSaMvSh0-g0-VYbFJDAB-cTFW2j2rngz8J-lQ3I6s=',
        customizable: false,
        available: false,
      },
      {
        name: 'Free Refil coca-cola',
        category_id: 2,
        description: '',
        amount: 0.1,
        url_img: '',
        customizable: false,
        available: false,
      },
      {
        name: 'Sorverte de baunilha',
        category_id: 3,
        description: 'Sorvete de baunilha cremoso',
        amount: 0.1,
        url_img: '',
        customizable: false,
        available: false,
      },
    ],
    skipDuplicates: true,
  });

  // Create Items
  await prisma.item.createMany({
    data: [
      {
        name: 'Hamburger de carne',
        description: '',
        amount: 0.01,
        quantity: 100,
      },
      {
        name: 'Bacon',
        description: '',
        amount: 0.01,
        quantity: 200,
      },
      {
        name: 'Salada',
        description: '',
        amount: 0.01,
        quantity: 100,
      },
    ],
    skipDuplicates: true,
  });

  // Create Admin User
  await prisma.collaborators.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      name: 'Admin User',
      document: '22272874207',
      password: '$2b$10$.a0Gr1n3KKKpJBQDcstCN.1gF0TOAz7sQsEmHZoKicCgNhpgwqrYW', // pass@123
      status: CollaboratorStatus.Active,
      type: CollaboratorType.Admin,
    },
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

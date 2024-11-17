const flavours = [
    {
        name: 'Apple Pie',
        slug: 'apple-pie',
        description: 'Delight on this delicious and classic flavour, with notes of cinnamon, a creamy ganache and a crunchy base.',
        mini_description: 'With notes of cinnamon, a creamy ganache and a crunchy base.',
        allergens: [
            { name: 'Milk Solids', slug: 'milk' },
            { name: 'Soy', slug: 'soy' }
        ],
        image: '/flavours/apple_pie.png',
    },
    {
        name: 'Baileys and Coffee',
        slug: 'coffee-with-baileys',
        description: 'For our coffee lovers we have this amazing blend of roasted coffee with Baileys.',
        mini_description: 'Roasted coffee with Baileys',
        allergens: [
            { name: 'Milk Solids', slug: 'milk' },
            { name: 'Soy', slug: 'soy' }
        ],
        image: '/flavours/baileys.png',
    },
    {
        name: 'Banana Caramel',
        slug: 'banana-caramel',
        description: 'A dark banana caramel blended with both milk and dark chocolate. It is a perfect flavour for those Banoffee lovers.',
        mini_description: 'Dark banana caramel with milk and dark chocolate',
        allergens: [
            { name: 'Milk Solids', slug: 'milk' },
            { name: 'Soy', slug: 'soy' }
        ],
        image: '/flavours/banana.png',
    },
    {
        name: 'Blackcurrant Cheesecake',
        slug: 'blackcurrant-cheesecake',
        description: 'A classic dessert that fits in the palm of your hand. Tangy and creamy, a perfect combination',
        mini_description: 'Tangy and creamy, a perfect combination',
        allergens: [
            { name: 'Milk Solids', slug: 'milk' },
            { name: 'Soy', slug: 'soy' }
        ],
        image: '/flavours/blackcurrant.png',
    },
    {
        name: 'Brownie',
        slug: 'brownie',
        description: 'A milk chocolate ganache with an amazing brownie filling!',
        mini_description: 'Milk chocolate ganache with brownie filling',
        allergens: [
            { name: 'Gluten', slug: 'gluten' },
            { name: 'Milk Solids', slug: 'milk' },
        ],
        image: '/flavours/brownie.png',
    },
    {
        name: 'Cookie Dough',
        slug: 'cookie-dough-gf',
        description: "This irresistible cooking snack is now gluten free. I'd wager you couldn't eat just one. Do you accept my challenge?",
        mini_description: 'An irresistible gluten free delight',
        allergens: [
            { name: 'Milk Solids', slug: 'milk' },
            { name: 'Soy', slug: 'soy' }
        ],
        image: '/flavours/cookie.png',
    },
    {
        name: 'Crunchy Peanut',
        slug: 'crunchy-peanut',
        description: 'A truly amazing flavour that brings the sweetness of a praline, with a touch of salt. Accompanied by our iconic milk chocolate ganache to balance it out.',
        mini_description: 'Brings the sweetness of a praline, with a touch of salt',
        allergens: [
            { name: 'Milk Solids', slug: 'milk' },
            { name: 'Nuts', slug: 'nuts' },
            { name: 'Soy', slug: 'soy' },
            { name: 'Wheat', slug: 'wheat' }
        ],
        image: '/flavours/crunchy.png',
    },
    {
        name: 'Horchata',
        slug: 'horchata',
        description: 'Inspired by a traditional Mexican drink that is made up of cinnamon, rice and milk.',
        mini_description: 'Inspired by a traditional Mexican drink made up of cinnamon, rice, and milk',
        allergens: [
            { name: 'Milk Solids', slug: 'milk' },
            { name: 'Soy', slug: 'soy' }
        ],
        image: '/flavours/horchata.png',
    },
    {
        name: 'Key Lime Pie',
        slug: 'key-lime-pie',
        description: 'Truly my favourite flavour. An amazing balance between sweet and sour with a thin cookie at the bottom to bring it all together.',
        mini_description: 'Sweet and sour with a thin cookie base',
        allergens: [
            { name: 'Gluten', slug: 'gluten' },
            { name: 'Milk Solids', slug: 'milk' },
            { name: 'Soy', slug: 'soy' }
        ],
        image: '/flavours/key.png',
    },
    {
        name: 'Mango and Passionfruit Caramel',
        slug: 'mango-and-passionfruit-caramel',
        description: 'The perfect caramel with the perfect consistency. We got it just right.',
        mini_description: 'The perfect caramel with the perfect consistency. We got it just right.',
        allergens: [
            { name: 'Milk Solids', slug: 'milk' },
            { name: 'Soy', slug: 'soy' }
        ],
        image: '/flavours/mango.png',
    },
    {
        name: 'Maple Crunch',
        slug: 'maple-crunch',
        description: 'A decadent and delicious flavour that bring maple and lotus biscuits together.',
        mini_description: 'A decadent and delicious flavour that bring maple and lotus biscuits together.',
        allergens: [
            { name: 'Gluten', slug: 'gluten' },
            { name: 'Milk Solids', slug: 'milk' },
            { name: 'Soy', slug: 'soy' }
        ],
        image: '/flavours/maple.png',
    },
    {
        name: 'Milk Chocolate Ganache',
        slug: 'milk-chocolate-ganache',
        description: 'A traditional flavour which offers a creamy and smooth texture to the chocolate. Perfect for chocolate lovers who want to stick to the classics.',
        mini_description: 'Traditional flavour with a creamy texture',
        allergens: [
            { name: 'Milk Solids', slug: 'milk' },
            { name: 'Soy', slug: 'soy' }
        ],
        image: '/flavours/milk.png',
    },
    {
        name: 'Passionfruit, Blood Orange and Guava',
        slug: 'passionfruit-blood-orange-and-guava',
        description: 'This is our only tri-layered chocolate. The combination of the three flavours gives it a truly tropical and refreshing feel.',
        mini_description: 'Three flavours for a tropical and refreshing taste',
        allergens: [
            { name: 'Milk Solids', slug: 'milk' },
            { name: 'Soy', slug: 'soy' }
        ],
        image: '/flavours/passion.png',
    },
    {
        name: 'Praline Feuilletine',
        slug: 'praline-feuilletine',
        description: "One of our most popular flavours. We have mixed feuilletine into the praline to add an extra layer of crunch to the already delicious praline.",
        mini_description: 'A popular flavour with an extra layer of crunch',
        allergens: [
           { name: 'Gluten', slug: 'gluten' },
            { name: 'Milk Solids', slug: 'milk' },
            { name: 'Soy', slug: 'soy' }
        ],
        image: '/flavours/praline.png',
    },
    {
        name: 'Strawberry and Vanilla',
        slug: 'strawberry-and-vanilla',
        description: 'One of our double layered bonbons, with the perfect blend of vanilla and strawberries.',
        mini_description: 'A delicious double layered bonbon',
        allergens: [
            { name: 'Milk Solids', slug: 'milk' },
            { name: 'Soy', slug: 'soy' }
        ],
        image: '/flavours/straw.png',
    },
    {
        name: 'Tangy mango',
        slug: 'tangy-mango',
        description: 'Try our Mexican inspired tangy mango bonbon. The perfect balance between sweet and sour.',
        mini_description: 'Mexican inspired tangy mango bonbon',
        allergens: [
            { name: 'Milk Solids', slug: 'milk' },
        ],
        image: '/flavours/tangy.png',
    },
    {
        name: 'Vanilla Pecan',
        slug: 'vanilla-pecan',
        description: 'This flavour has been in the works for a while. A remarkable sweet and nutty delight.',
        mini_description: 'A remarkable sweet and nutty delight',
        allergens: [
            { name: 'Milk Solids', slug: 'milk' },
            { name: 'Nuts', slug: 'nuts' },
            { name: 'Soy', slug: 'soy' },
            { name: 'Wheat', slug: 'wheat' }
        ],
        image: '/flavours/vanilla.png',
    },
    {
        name: 'Whisky and Vanilla Caramel',
        slug: 'whisky-and-vanilla-caramel',
        description: 'A perfect after dinner treat',
        mini_description: 'A perfect after dinner treat',
        allergens: [
            { name: 'Milk Solids', slug: 'milk' },
            { name: 'Soy', slug: 'soy' }
        ],
        image: '/flavours/whisky.png',
    },

];

export default flavours;

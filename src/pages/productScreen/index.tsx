import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import CustomSearch from '../../components/CustomSearch';
import ProductPage from '../../components/ProductPage';
import { useRoute } from '@react-navigation/native';

const ceraVeProduct = {
  id: 'cerave-moisturizing-cream',
  name: 'CeraVe Moisturising Cream',
  shortDescription:
    'Deep hydration, 24-hour moisture, and a healthy skin barrier',
  images: [
    'https://i5.walmartimages.com/seo/CeraVe-Moisturizing-Cream-with-Pump-19-Ounce_d14dc483-6ca6-49f1-a2ff-701d071ce26f.92134421716039f1fe1b6725cc0b6603.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF',
    'https://i5.walmartimages.com/seo/CeraVe-Moisturizing-Cream-with-Pump-19-Ounce_d14dc483-6ca6-49f1-a2ff-701d071ce26f.92134421716039f1fe1b6725cc0b6603.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF',
    'https://i5.walmartimages.com/seo/CeraVe-Moisturizing-Cream-with-Pump-19-Ounce_d14dc483-6ca6-49f1-a2ff-701d071ce26f.92134421716039f1fe1b6725cc0b6603.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF',
    'https://i5.walmartimages.com/seo/CeraVe-Moisturizing-Cream-with-Pump-19-Ounce_d14dc483-6ca6-49f1-a2ff-701d071ce26f.92134421716039f1fe1b6725cc0b6603.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF',
  ],
  mrp: 1746,
  discountPrice: 1746,
  specialOffer: '50%OFF on SFD Card',
  variants: [
    {
      weight: '340 gm',
      price: 1500,
      pricePerGram: '₹4.41 / 1 gm',
      inStock: true,
      stockStatus: 'In Stock',
    },
    {
      weight: '454 gm',
      price: 1800,
      pricePerGram: '₹3.96 / 1 gm',
      inStock: false,
      stockStatus: 'Out of Stock',
    },
    {
      weight: '340 gm',
      price: 1500,
      pricePerGram: '₹4.41 / 1 gm',
      inStock: true,
      stockStatus: 'Only 2 Left',
    },
    {
      weight: '340 gm',
      price: 1500,
      pricePerGram: '₹4.41 / 1 gm',
      inStock: true,
      stockStatus: 'In Stock',
    },
  ],
  dosage: {
    timing: ['Before Breakfast', 'After Lunch', 'After Dinner'],
    time: ['08:00 AM', '02:02 PM', '08:08 PM'],
  },
  description:
    'CeraVe Moisturising Cream for Dry Skin is a specially formulated skincare product that aims to replenish dry to very dry skin. Developed by dermatologists, the CeraVe formulation is infused with essential components such as ceramides and hyaluronic acid that work together to deeply hydrate the skin and maintain its health and quality.',
  features: [
    'Infused with MVE technology',
    'Enriched with marine and botanical complex',
    'Dermatologist-recommended',
    'Non-comedogenic and fragrance-free',
    'Formulated with 3 essential ceramides & hyaluronic acid',
    'Suitable for both face and body application',
  ],
  directions: [
    'Cleanse the skin thoroughly.',
    'Take a sufficient amount of CeraVe Ceramides Moisturizing Cream for Dry Skin on your fingertips.',
    'Dermatologist-developed formula.',
    'Apply it evenly, and rub in, paying special attention to dry patches.',
    'Massage the cream in a circular motion until it is fully absorbed.',
  ],
  faqs: [
    {
      question: 'Is CeraVe Moisturizing Cream suitable for all skin types?',
      answer:
        'CeraVe Moisturizing Cream has been specifically designed for dry to very dry skin. However, its non-comedogenic and fragrance-free formulation makes it suitable for most skin types unless you have a specific sensitivity to any of its ingredients.',
    },
    {
      question: 'How long does the moisturizing effect last?',
      answer:
        'The unique formulation with MVE technology ensures your skin stays hydrated for up to 24 hours, protecting it throughout the day and night.',
    },
  ],
};

const similarProducts = [
  {
    id: 'neutrogena-hydro-boost',
    name: 'Neutrogena Hydro Boost',
    image: 'https://example.com/neutrogena.jpg',
    price: 299,
    mrp: 459,
    discountPercent: 35,
  },
  {
    id: 'nivea-men-cream',
    name: 'Nivea Men Cream',
    image: 'https://example.com/nivea.jpg',
    price: 230,
    mrp: 459,
    discountPercent: 45,
  },
  {
    id: 'biotique-serum',
    name: 'Biotique Bio Serum',
    image: 'https://example.com/biotique.jpg',
    price: 299,
    mrp: 459,
    discountPercent: 35,
  },
  {
    id: 'neutrogena-spf',
    name: 'Neutrogena SPF 50',
    image: 'https://example.com/neutrogena-spf.jpg',
    price: 299,
    mrp: 459,
    discountPercent: 35,
  },
];

const ProductScreen = () => {
  const route = useRoute();

  const {product} = route.params || {};


  return (
    <ScrollView>
      <CustomSearch />
      <ProductPage product={product} similarProducts={similarProducts} />
    </ScrollView>
  );
};

export default ProductScreen;

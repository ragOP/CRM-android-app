// import React, {useState} from 'react';
// import {StyleSheet, Text, View} from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import CategoryCard from '../CategoryCard';

// interface GradientHeaderProps {
//   title: string;
//   description: string;
//   height?: number;
//   isHomePage?: boolean;
// }

// const categories = [
//   {
//     label: 'Pharmaceuticals',
//     image: require('../../assets/pharmaceutical.png'),
//   },
//   {label: 'Laundry', image: require('../../assets/laundry.png')},
//   {label: 'Blog', image: require('../../assets/blog.png')},
//   {label: 'Home Cleaning', image: require('../../assets/homecleaning.png')},
// ];

// const GradientHeader = ({
//   title,
//   description,
//   height = 100,
//   isHomePage,
// }: GradientHeaderProps) => {
//   const [categories, setCategories] = useState([]);

//   return (
//     <LinearGradient
//       colors={['#82C8E5', '#F7F7F7']}
//       style={[styles.header, {height}]}>
//       <View style={styles.container}>
//         <Text style={styles.headerTitle}>{title}</Text>
//         <Text style={styles.subTitle}>{description}</Text>
//         {isHomePage && (
//           <View style={styles.categoryContainer}>
//             {categories.map((category, index) => (
//               <CategoryCard
//                 key={index}
//                 label={category.label}
//                 image={category.image}
//               />
//             ))}
//           </View>
//         )}
//       </View>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'flex-start',
//     paddingHorizontal: 16,
//   },
//   header: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 25,
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: '800',
//     fontFamily: 'Gilroy-Bold',
//     color: '#04050B',
//   },
//   subTitle: {
//     fontSize: 14,
//     color: '#333333',
//   },

//   categoryContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     flexWrap: 'wrap',
//     // padding: 10,
//   },
// });

// export default index;

import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CategoryCard from '../CategoryCard';
import {useDispatch, useSelector} from 'react-redux';
import {fetchCategories} from '../../redux/slice/categorySlice';
import {RootState, useAppDispatch, useAppSelector} from '../../redux/store';
import {isArrayWithValues} from '../../utils/array/isArrayWithValues';

interface GradientHeaderProps {
  title: string;
  description: string;
  height?: number;
  isHomePage?: boolean;
}

const GradientHeader = ({
  title,
  description,
  height = 100,
  isHomePage,
}: GradientHeaderProps) => {
  const dispatch = useAppDispatch();
  const {data: categories, isFetching} = useAppSelector(
    state => state.category,
  );

  useEffect(() => {
    if (isHomePage) {
      dispatch(fetchCategories({}));
    }
  }, [dispatch, isHomePage]);

  console.log('Categories:', categories);

  return (
    <LinearGradient
      colors={['#82C8E5', '#F7F7F7']}
      style={[styles.header, {height}]}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.subTitle}>{description}</Text>
        {isHomePage && (
          <View style={styles.categoryContainer}>
            {isFetching ? (
              <Text>Loading...</Text>
            ) : isArrayWithValues(categories) ? (
              categories.map((category: any, index: number) => (
                <CategoryCard
                  key={index}
                  label={category.name || ""}
                  image={category.images?.[0]}
                />
              ))
            ) : null}
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 25,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    fontFamily: 'Gilroy-Bold',
    color: '#04050B',
  },
  subTitle: {
    fontSize: 14,
    color: '#333333',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
});

export default GradientHeader;

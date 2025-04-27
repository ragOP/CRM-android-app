import { View, Text, StyleSheet, ScrollView} from 'react-native';
import BlogCard from '../BlogCard';

const blogData = [
    {
        id: '1',
        category: 'LAUNDRY & DRY CLEANING',
        name: 'Jane Doe',
        upload: '5 months ago',
        description: 'Laundry Pickup And Delivery Services Advantages | Washmart',
        image: require('../../assets/blogCardBg.png'),
    },
    {
        id: '2',
        category: 'LAUNDRY & DRY CLEANING',
        name: 'Jane Doe',
        upload: '5 months ago',
        description: 'Laundry Pickup And Delivery Services Advantages | Washmart',
        image: require('../../assets/blogCardBg.png'),
    }, {
        id: '3',
        category: 'LAUNDRY & DRY CLEANING',
        name: 'Jane Doe',
        upload: '5 months ago',
        description: 'Laundry Pickup And Delivery Services Advantages | Washmart',
        image: require('../../assets/blogCardBg.png'),
    }, {
        id: '4',
        category: 'LAUNDRY & DRY CLEANING',
        name: 'Jane Doe',
        upload: '5 months ago',
        description: 'Laundry Pickup And Delivery Services Advantages | Washmart',
        image: require('../../assets/blogCardBg.png'),
    },
];

const Blog = () => {
    return(
        <View style={styles.container} >
            <Text style={styles.title}>
               Blogs
            </Text>
            <ScrollView horizontal  showsHorizontalScrollIndicator={false} style={{paddingVertical: 10}}>
                {blogData.map((item) => (
                    <BlogCard key={item.id} {...item} />
                ))}
            </ScrollView>
        </View>
    )
}

export default Blog;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#00008B',
    },
})
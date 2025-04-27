import {View, Text, StyleSheet, ImageBackground} from 'react-native';

interface BlogCardProps {
  category: string;
  name: string;
  upload?: string;
  description?: string;
  image?: any;
}

const BlogCard: React.FC<BlogCardProps> = ({
  category,
  name,
  upload,
  description,
  image,
}) => {
  return (
    // <View style={styles.container}>
      <ImageBackground
        source={image}
        style={styles.container}
        resizeMode="cover"
        >
        <Text style={styles.category}>{category}</Text>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 15}}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.upload}>
            {upload || 'Uploaded on: 01/01/2023'}
          </Text>
        </View>
        <Text style={styles.description}>
          {description || 'This is a short description of the blog post.'}
        </Text>
      </ImageBackground>
    // </View>
  );
};

export default BlogCard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        width: 220,
        height: 150,
        marginRight: 10,
        padding: 10,
        borderRadius: 20,
        overflow: 'hidden',
    },
    blogCardImage: {
        height: '100%',
        borderRadius: 30,
    },
    category: {
        position: 'absolute',
        top: 10,
        left: 10,
        padding: 5,
        borderRadius: 10,
        backgroundColor: '#82C8E5',
        fontSize: 10,
        color: '#1A1A1A',
        fontWeight: '600',
    },
    name: {
        fontSize: 12,
        fontWeight: '500',
        color: '#fff'
    }, 
    upload: {
        fontSize: 12,
        fontWeight: '500',
        color: '#fff'
    },
    description: {
        fontSize: 10,
        fontWeight: '400',
        color: '#fff'
    },
});

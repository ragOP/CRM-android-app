import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Button,
} from 'react-native';
import axios from 'axios';

interface Author {
  _id: string;
  name: string;
  email: string;
  role: string;
  services: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Service {
  _id: string;
  name: string;
  slug: string;
  description: string;
  meta_data: any;
  images: string[];
  created_by_admin: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface BlogData {
  _id: string;
  title: string;
  author?: Author;
  bannerImageUrl: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isFeatured: boolean;
  published: boolean;
  service: Service;
  short_description: string;
  __v: number;
}

const stripHtml = (html: string): string => {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '\n$1\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '\n$1\n')
    .replace(/<\/?[^>]+(>|$)/g, '') // remove all other tags
    .trim();
};

const BlogScreen = () => {
  const [blogList, setBlogList] = useState<BlogData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBlog, setSelectedBlog] = useState<BlogData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(
        'https://2c66-84-247-129-99.ngrok-free.app/api/blog',
      );
      if (response.data?.data) {
        setBlogList(response.data.data);
      } else {
        console.warn('No blog data found');
      }
    } catch (error) {
      console.error('Error fetching blog data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogDetails = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://2c66-84-247-129-99.ngrok-free.app/api/blog/${id}`,
      );
      setSelectedBlog(response.data.data);
    } catch (error) {
      console.error('Error fetching blog details:', error);
      setError('Failed to load blog. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleBlogPress = (id: string) => {
    fetchBlogDetails(id);
  };

  const handleBack = () => {
    setSelectedBlog(null);
    setError(null);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (selectedBlog) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={handleBack} style={styles.customButton}>
          <Text style={styles.customButtonText}>Back to Blogs</Text>
        </TouchableOpacity>

        <Image
          source={{uri: selectedBlog.bannerImageUrl}}
          style={styles.banner}
        />
        <Text style={styles.title}>{selectedBlog.title}</Text>
        <Text style={styles.author}>
          By {selectedBlog.author?.name ?? 'Unknown Author'}
        </Text>
        <Text style={styles.description}>{selectedBlog.short_description}</Text>
        <Text style={styles.content}>{stripHtml(selectedBlog.content)}</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {blogList.map(item => (
        <TouchableOpacity
          key={item._id}
          style={styles.blogCard}
          onPress={() => handleBlogPress(item._id)}>
          <Image
            source={{uri: item.bannerImageUrl}}
            style={styles.banner}
            resizeMode="cover"
          />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.author}>
            By {item.author?.name ?? 'Unknown Author'}
          </Text>
          <Text style={styles.description}>{item.short_description}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  blogCard: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
  },
  banner: {
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  author: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
  },
  content: {
    fontSize: 16,
    color: '#222',
    marginTop: 12,
    lineHeight: 22,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButton: {
    backgroundColor: '#007BFF', // Blue background color
    borderRadius: 50, // Rounded corners
    paddingVertical: 12, // Vertical padding
    paddingHorizontal: 24, // Horizontal padding
    marginTop: 20, // Top margin for spacing
    alignItems: 'center', // Center text horizontally
    justifyContent: 'center', // Center text vertically
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: {width: 0, height: 2}, // Shadow offset
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 4, // Shadow radius for iOS
  },
  customButtonText: {
    color: '#fff', // White text color
    fontSize: 18, // Text size
    fontWeight: '600', // Text weight
    textAlign: 'center', // Center align text
  },
});

export default BlogScreen;

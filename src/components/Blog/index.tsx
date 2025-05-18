import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {BACKEND_URL} from '../../utils/url';
import {Button, Icon, IconButton} from 'react-native-paper';
import {isArrayWithValues} from '../../utils/array/isArrayWithValues';
import { useNavigation } from '@react-navigation/native';

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
  const navigation = useNavigation();

  const [blogList, setBlogList] = useState<BlogData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBlog, setSelectedBlog] = useState<BlogData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/blog`);
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
      const response = await axios.get(`${BACKEND_URL}/api/blog/${id}`);
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
      <ScrollView contentContainerStyle={{flex: 1}}>
        <TouchableOpacity onPress={handleBack} style={styles.customButton}>
          <IconButton
            icon="arrow-left"
            iconColor="#000"
            size={24}
            onPress={handleBack}
          />
          <Text style={styles.customButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={{padding: 16}}>
          <Image
            source={{uri: selectedBlog.bannerImageUrl}}
            style={styles.banner}
          />
          <Text style={styles.title}>{selectedBlog.title}</Text>
          <Text style={styles.author}>
            By {selectedBlog.author?.name ?? 'Unknown Author'}
          </Text>
          <Text style={styles.description}>
            {selectedBlog.short_description}
          </Text>
          <Text style={styles.content}>{stripHtml(selectedBlog.content)}</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <IconButton
          icon="arrow-left"
          iconColor="#000"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={[styles.title, {marginTop: 8}]}>
          Blogs {isArrayWithValues(blogList) ? `(${blogList.length})` : ''}
        </Text>
      </View>
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
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
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
    marginBottom: 12,
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
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  customButtonText: {
    color: '#000', // White text color
    fontSize: 18, // Text size
    fontWeight: '600', // Text weight
    textAlign: 'center', // Center align text
  },
});

export default BlogScreen;

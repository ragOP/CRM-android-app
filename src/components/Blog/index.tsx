import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import {BACKEND_URL} from '../../utils/url';
import {Button, IconButton} from 'react-native-paper';
import {isArrayWithValues} from '../../utils/array/isArrayWithValues';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RenderHTML from 'react-native-render-html';

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
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/blog`);
      if (response.data?.data) {
        setBlogList(response.data.data);
      } else {
        setBlogList([]);
        console.warn('No blog data found');
      }
    } catch (error) {
      setBlogList([]);
      console.error('Error fetching blog data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <LinearGradient
        colors={['#f5f7fa', '#c3cfe2']}
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading...</Text>
      </LinearGradient>
    );
  }

  if (selectedBlog) {
    return (
      <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={{flex: 1}}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
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
            {/* <Text style={styles.content}>
              {stripHtml(selectedBlog.content)}
            </Text> */}
            <RenderHTML source={{html: selectedBlog.content}} />
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
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
        {isArrayWithValues(blogList) ? (
          blogList.map(item => (
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
          ))
        ) : (
          <View style={styles.emptyStateContainer}>
            <MaterialCommunityIcons
              name="post-outline"
              size={54}
              color="#bfc8e4"
              style={{marginBottom: 12}}
            />
            <Text style={styles.emptyTitle}>No Blogs Yet</Text>
            <Text style={styles.emptySubtitle}>
              There are no blogs available at the moment.
            </Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
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
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default BlogScreen;

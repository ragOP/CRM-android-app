import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import StarRating, {StarRatingDisplay} from 'react-native-star-rating-widget';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {fetchReviews} from '../../../apis/fetchReviews';
import {createReviews} from '../../../apis/createReviews';
import {ToastAndroid} from 'react-native';
import {useAppDispatch} from '../../../redux/store';
import {showSnackbar} from '../../../redux/slice/snackbarSlice';

export type ReviewPayload = {
  productId: string;
  title: string;
  rating: number;
  description: string;
};

// Review Item Component
const ReviewItem = ({review}: any) => {
  return (
    <View style={styles.reviewItemContainer}>
      <Text style={styles.reviewTitle}>{review.title}</Text>
      <View style={styles.ratingContainer}>
        <StarRatingDisplay rating={review.rating} starSize={20} />
        {/* <Text style={styles.reviewRating}>Rating: {review.rating} / 5</Text> */}
      </View>
      <Text style={styles.reviewDescription}>{review.description}</Text>
    </View>
  );
};

// Post Review Button Component
const PostReviewButton = ({onPress}: any) => {
  return (
    <TouchableOpacity style={styles.postReviewButton} onPress={onPress}>
      <Text style={styles.buttonText}>Post a Review</Text>
    </TouchableOpacity>
  );
};

// Modal for Posting Review
const PostReviewModal = ({
  visible,
  onClose,
  onSubmit,
  title,
  setTitle,
  rating,
  setRating,
  description,
  setDescription,
  isSaving,
}: any) => {
  const handleSubmit = () => {
    if (isSaving) {
      return;
    }
    const newReview = {title, rating, description};
    onSubmit(newReview);
  };

  const onChangeRating = (newRating: number) => {
    setRating(newRating);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeading}>Post a Review</Text>
          <TextInput
            style={styles.input}
            placeholder="Review Title"
            value={title}
            onChangeText={setTitle}
          />
          <StarRating rating={rating} onChange={onChangeRating} />
          <TextInput
            style={[styles.input, {height: 80}]}
            placeholder="Review Description"
            multiline
            value={description}
            onChangeText={setDescription}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}>
              <Text style={styles.buttonText}>
                {isSaving ? 'Saving' : 'Submit'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

type ProductReviewsProps = {
  productId: string;
};

const ProductReviews = ({productId}: ProductReviewsProps) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');

  const params = {productId: productId, page: 1, per_page: 50};

  const {
    data: reviews = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      try {
        return await fetchReviews({params});
      } catch (error) {
        throw new Error('Failed to fetch reviews');
      }
    },
    staleTime: 300000,
  });

  console.log('Reviews:', reviews);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const onRefresh = async () => {
    setIsRefreshing(true);

    setTimeout(() => {
      queryClient.invalidateQueries({queryKey: ['reviews']});
      setIsRefreshing(false);
    }, 1000);
  };

  const {mutate: postReview, isPending: isPosting} = useMutation({
    mutationFn: (payload: ReviewPayload) => createReviews({payload}),
    onSuccess: res => {
      if (res?.response?.success) {
        console.log('Review posted successfully:', res);
        dispatch(
          showSnackbar({
            type: 'success',
            title: 'Review posted successfully!',
            placement: 'top',
          }),
        );
        queryClient.invalidateQueries({queryKey: ['reviews', productId]});
      } else {
        const errorMessage = res?.response?.data?.message;
        dispatch(
          showSnackbar({
            type: 'error',
            title: errorMessage || 'Failed to post review. Please try again.',
            placement: 'top',
          }),
        );
      }
    },
    onError: err => {
      console.error('Error posting review:', err);
    },
  });

  const handlePostReview = (review: any) => {
    if (
      !review.title ||
      review.title.trim() === '' ||
      !review.rating ||
      review.rating <= 0 ||
      !review.description ||
      review.description.trim() === ''
    ) {
      ToastAndroid.show('Please fill all fields', ToastAndroid.SHORT);
      return;
    }

    const payload: ReviewPayload = {
      productId: productId,
      title: review.title,
      rating: review.rating,
      description: review.description,
    };
    postReview(payload);
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Product Reviews {reviews?.length > 0 ? `(${reviews?.length})` : ''}
      </Text>
      <FlatList
        data={reviews}
        keyExtractor={item => item.id}
        renderItem={({item}) => <ReviewItem review={item} />}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No reviews yet.</Text>
        }
      />
      <PostReviewButton onPress={() => setShowModal(true)} />
      <PostReviewModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handlePostReview}
        isSaving={isPosting}
        title={title}
        setTitle={setTitle}
        rating={rating}
        setRating={setRating}
        description={description}
        setDescription={setDescription}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    gap: 8,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  reviewItemContainer: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  reviewRating: {
    fontSize: 14,
    color: '#777',
    marginLeft: 10,
  },
  reviewDescription: {
    fontSize: 14,
    marginTop: 5,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
  },
  postReviewButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    elevation: 5,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    marginTop: 12,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelButton: {
    backgroundColor: '#fff',
    color: '#000',
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});

export default ProductReviews;

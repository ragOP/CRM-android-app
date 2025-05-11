import {ScrollView, RefreshControl, ScrollViewProps} from 'react-native';

type RefreshControlWrapperProps = {
  refreshing: boolean;
  onRefresh: () => void;
  children: React.ReactNode;
} & ScrollViewProps;

const RefreshControlWrapper = ({
  refreshing,
  onRefresh,
  children,
  ...rest
}: RefreshControlWrapperProps) => {
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      {...rest}>
      {children}
    </ScrollView>
  );
};

export default RefreshControlWrapper;

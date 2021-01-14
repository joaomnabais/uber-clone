import { Platform, PixelRatio } from 'react-native';

export function generateEdgePadding(edgePadding) {

  if(Platform.OS === 'ios'){
    return edgePadding;
  }
  
  return {
    top: PixelRatio.getPixelSizeForLayoutSize(edgePadding.top),
    right: PixelRatio.getPixelSizeForLayoutSize(edgePadding.right),
    left: PixelRatio.getPixelSizeForLayoutSize(edgePadding.left),
    bottom: PixelRatio.getPixelSizeForLayoutSize(edgePadding.bottom)
  };
};
#ifdef __OBJC__
#import <UIKit/UIKit.h>
#else
#ifndef FOUNDATION_EXPORT
#if defined(__cplusplus)
#define FOUNDATION_EXPORT extern "C"
#else
#define FOUNDATION_EXPORT extern
#endif
#endif
#endif

#import "CameraDevice.hpp"
#import "CameraResult.hpp"
#import "CropRatio.hpp"
#import "CropResult.hpp"
#import "HybridMultipleImagePickerSpec.hpp"
#import "Language.hpp"
#import "MediaPreview.hpp"
#import "MediaType.hpp"
#import "NitroCameraConfig.hpp"
#import "NitroConfig.hpp"
#import "NitroCropConfig.hpp"
#import "NitroPreviewConfig.hpp"
#import "PickerCameraConfig.hpp"
#import "PickerCropConfig.hpp"
#import "PickerResult.hpp"
#import "Presentation.hpp"
#import "ResultType.hpp"
#import "SelectBoxStyle.hpp"
#import "SelectMode.hpp"
#import "Text.hpp"
#import "Theme.hpp"
#import "MultipleImagePicker-Swift-Cxx-Bridge.hpp"

FOUNDATION_EXPORT double MultipleImagePickerVersionNumber;
FOUNDATION_EXPORT const unsigned char MultipleImagePickerVersionString[];


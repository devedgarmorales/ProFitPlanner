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

#import "AnyMap.hpp"
#import "ArrayBuffer.hpp"
#import "HybridObject.hpp"
#import "Promise.hpp"
#import "HybridNitroModulesProxy.hpp"
#import "InstallNitro.hpp"
#import "HybridObjectRegistry.hpp"
#import "JSIConverter.hpp"
#import "NitroLogger.hpp"
#import "Dispatcher.hpp"
#import "NitroHash.hpp"
#import "NitroDefines.hpp"
#import "ArrayBufferHolder.hpp"
#import "AnyMapHolder.hpp"
#import "HybridContext.hpp"
#import "PromiseHolder.hpp"
#import "Result.hpp"
#import "RuntimeError.hpp"
#import "SwiftClosure.hpp"

FOUNDATION_EXPORT double NitroModulesVersionNumber;
FOUNDATION_EXPORT const unsigned char NitroModulesVersionString[];


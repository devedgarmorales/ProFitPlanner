#import <React/RCTBridgeModule.h>
#import <Security/Security.h>

@interface ProfitCredentialStorage : NSObject <RCTBridgeModule>
@end

@implementation ProfitCredentialStorage
RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup { return NO; }

- (NSDictionary *)query
{
  return @{(__bridge id)kSecClass: (__bridge id)kSecClassGenericPassword,
           (__bridge id)kSecAttrService: @"com.profitplanner.credentials.v1",
           (__bridge id)kSecAttrAccount: @"auth_tokens"};
}

RCT_REMAP_METHOD(get, getWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  NSMutableDictionary *query = [[self query] mutableCopy];
  query[(__bridge id)kSecReturnData] = @YES;
  query[(__bridge id)kSecMatchLimit] = (__bridge id)kSecMatchLimitOne;
  CFTypeRef result = NULL;
  OSStatus status = SecItemCopyMatching((__bridge CFDictionaryRef)query, &result);
  if (status == errSecItemNotFound) { resolve([NSNull null]); return; }
  if (status != errSecSuccess) { reject(@"CREDENTIAL_READ_FAILED", @"Unable to read secure credentials.", nil); return; }
  NSData *data = CFBridgingRelease(result);
  NSString *value = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
  if (!value) { reject(@"CREDENTIAL_READ_FAILED", @"Invalid secure credential encoding.", nil); return; }
  resolve(value);
}

RCT_REMAP_METHOD(set, setValue:(NSString *)value resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  NSDictionary *attributes = @{(__bridge id)kSecValueData: [value dataUsingEncoding:NSUTF8StringEncoding],
                               (__bridge id)kSecAttrAccessible: (__bridge id)kSecAttrAccessibleWhenUnlockedThisDeviceOnly};
  OSStatus status = SecItemUpdate((__bridge CFDictionaryRef)[self query], (__bridge CFDictionaryRef)attributes);
  if (status == errSecItemNotFound) {
    NSMutableDictionary *entry = [[self query] mutableCopy];
    [entry addEntriesFromDictionary:attributes];
    status = SecItemAdd((__bridge CFDictionaryRef)entry, NULL);
  }
  if (status != errSecSuccess) { reject(@"CREDENTIAL_WRITE_FAILED", @"Unable to save secure credentials.", nil); return; }
  resolve([NSNull null]);
}

RCT_REMAP_METHOD(clear, clearWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  OSStatus status = SecItemDelete((__bridge CFDictionaryRef)[self query]);
  if (status != errSecSuccess && status != errSecItemNotFound) { reject(@"CREDENTIAL_CLEAR_FAILED", @"Unable to remove secure credentials.", nil); return; }
  resolve([NSNull null]);
}
@end

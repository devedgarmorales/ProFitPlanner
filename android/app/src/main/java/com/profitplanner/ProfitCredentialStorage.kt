package com.profitplanner

import android.content.Context
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.*
import com.facebook.react.uimanager.ViewManager
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

class ProfitCredentialStorage(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    private val preferences = context.getSharedPreferences("profit_credentials", Context.MODE_PRIVATE)
    private val alias = "com.profitplanner.credentials.v1"

    override fun getName() = "ProfitCredentialStorage"

    private fun encryptionKey(): SecretKey {
        val store = KeyStore.getInstance("AndroidKeyStore").apply { load(null) }
        val existing = store.getKey(alias, null)
        if (existing is SecretKey) return existing
        return KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore").apply {
            init(KeyGenParameterSpec.Builder(alias, KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT)
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .setKeySize(256)
                .build())
        }.generateKey()
    }

    @ReactMethod
    fun get(promise: Promise) {
        try {
            val encoded = preferences.getString("tokens", null)
            if (encoded == null) {
                promise.resolve(null)
                return
            }
            val parts = encoded.split(":")
            require(parts.size == 2) { "Invalid credential format" }
            val cipher = Cipher.getInstance("AES/GCM/NoPadding")
            cipher.init(Cipher.DECRYPT_MODE, encryptionKey(), GCMParameterSpec(128, Base64.decode(parts[0], Base64.NO_WRAP)))
            promise.resolve(String(cipher.doFinal(Base64.decode(parts[1], Base64.NO_WRAP)), Charsets.UTF_8))
        } catch (error: Exception) {
            // A restored ciphertext cannot be recovered without this device's key.
            preferences.edit().remove("tokens").commit()
            promise.reject("CREDENTIAL_READ_FAILED", "Unable to read secure credentials. Sign in again.", error)
        }
    }

    @ReactMethod
    fun set(value: String, promise: Promise) {
        try {
            val cipher = Cipher.getInstance("AES/GCM/NoPadding")
            cipher.init(Cipher.ENCRYPT_MODE, encryptionKey())
            val encrypted = cipher.doFinal(value.toByteArray(Charsets.UTF_8))
            val encoded = Base64.encodeToString(cipher.iv, Base64.NO_WRAP) + ":" + Base64.encodeToString(encrypted, Base64.NO_WRAP)
            check(preferences.edit().putString("tokens", encoded).commit()) { "Credential write failed" }
            promise.resolve(null)
        } catch (error: Exception) {
            promise.reject("CREDENTIAL_WRITE_FAILED", "Unable to save secure credentials.", error)
        }
    }

    @ReactMethod
    fun clear(promise: Promise) {
        try {
            check(preferences.edit().remove("tokens").commit()) { "Credential removal failed" }
            promise.resolve(null)
        } catch (error: Exception) {
            promise.reject("CREDENTIAL_CLEAR_FAILED", "Unable to remove secure credentials.", error)
        }
    }
}

class ProfitCredentialPackage : ReactPackage {
    override fun createNativeModules(context: ReactApplicationContext): List<NativeModule> = listOf(ProfitCredentialStorage(context))
    override fun createViewManagers(context: ReactApplicationContext): List<ViewManager<*, *>> = emptyList()
}

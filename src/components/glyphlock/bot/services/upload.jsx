import { base44 } from '@/api/base44Client';

/**
 * Upload Service - Wrapper around glyphbotFileUpload and media upload
 */

export async function file(fileToUpload, analysisType = 'general') {
  try {
    const formData = new FormData();
    formData.append('file', fileToUpload);

    const response = await base44.functions.invoke('glyphbotFileUpload', formData);
    return response.data;
  } catch (error) {
    console.error('[Upload Service] Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function analyzeFile(fileId, prompt, analysisType = 'general') {
  try {
    const response = await base44.functions.invoke('glyphbotFileUpload', {
      fileId,
      prompt,
      analysisType
    });
    return response.data;
  } catch (error) {
    console.error('[File Analysis Service] Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function media(fileToUpload) {
  try {
    const uploadResult = await base44.integrations.Core.UploadFile({ file: fileToUpload });
    return {
      success: true,
      file_url: uploadResult.file_url
    };
  } catch (error) {
    console.error('[Media Upload Service] Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export default { file, analyzeFile, media };
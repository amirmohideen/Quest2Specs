#include <metal_stdlib>
#include <simd/simd.h>
using namespace metal;
#ifdef borderOnly
#undef borderOnly
#endif
#ifdef cutOutCenter
#undef cutOutCenter
#endif
namespace SNAP_VS {
int sc_GetStereoViewIndex()
{
return 0;
}
}
#ifndef sc_TextureRenderingLayout_Regular
#define sc_TextureRenderingLayout_Regular 0
#define sc_TextureRenderingLayout_StereoInstancedClipped 1
#define sc_TextureRenderingLayout_StereoMultiview 2
#endif
// SCC_BACKEND_SHADER_FLAGS_BEGIN__
// SCC_BACKEND_SHADER_FLAG_DISABLE_FRUSTUM_CULLING
// SCC_BACKEND_SHADER_FLAGS_END__
//SG_REFLECTION_BEGIN(200)
//attribute vec4 boneData 5
//attribute vec3 blendShape0Pos 6
//attribute vec3 blendShape0Normal 12
//attribute vec3 blendShape1Pos 7
//attribute vec3 blendShape1Normal 13
//attribute vec3 blendShape2Pos 8
//attribute vec3 blendShape2Normal 14
//attribute vec3 blendShape3Pos 9
//attribute vec3 blendShape4Pos 10
//attribute vec3 blendShape5Pos 11
//attribute vec4 position 0
//attribute vec3 normal 1
//attribute vec4 tangent 2
//attribute vec2 texture0 3
//attribute vec2 texture1 4
//attribute vec4 color 18
//attribute vec3 positionNext 15
//attribute vec3 positionPrevious 16
//attribute vec4 strandProperties 17
//output vec4 sc_FragData0 0
//sampler sampler backgroundSmpSC 0:18
//sampler sampler circleTextureSmpSC 0:19
//sampler sampler intensityTextureSmpSC 0:20
//sampler sampler sc_ScreenTextureSmpSC 0:25
//texture texture2D background 0:1:0:18
//texture texture2D circleTexture 0:2:0:19
//texture texture2D intensityTexture 0:3:0:20
//texture texture2D sc_ScreenTexture 0:15:0:25
//ubo float sc_BonesUBO 0:0:96 {
//sc_Bone_t sc_Bones 0:[1]:96
//float4 sc_Bones.boneMatrix 0:[3]:16
//float4 sc_Bones.normalMatrix 48:[3]:16
//}
//ubo int UserUniforms 0:28:4960 {
//float4 sc_Time 1376
//float4 sc_UniformConstants 1392
//float4x4 sc_ViewProjectionMatrixArray 1680:[2]:64
//float4x4 sc_ModelViewMatrixArray 1936:[2]:64
//float4x4 sc_ProjectionMatrixArray 2384:[2]:64
//float4x4 sc_ProjectionMatrixInverseArray 2512:[2]:64
//float4x4 sc_ViewMatrixArray 2640:[2]:64
//float4x4 sc_PrevFrameViewProjectionMatrixArray 2896:[2]:64
//float4x4 sc_ModelMatrix 3024
//float4x4 sc_ModelMatrixInverse 3088
//float3x3 sc_NormalMatrix 3152
//float4x4 sc_PrevFrameModelMatrix 3248
//float4 sc_CurrentRenderTargetDims 3456
//sc_Camera_t sc_Camera 3472
//float3 sc_Camera.position 0
//float sc_Camera.aspect 16
//float2 sc_Camera.clipPlanes 24
//float sc_ShadowDensity 3504
//float4 sc_ShadowColor 3520
//float4x4 sc_ProjectorMatrix 3536
//float4 weights0 3616
//float4 weights1 3632
//float4 sc_StereoClipPlanes 3664:[2]:16
//float2 sc_TAAJitterOffset 3704
//float4 voxelization_params_0 3824
//float4 voxelization_params_frustum_lrbt 3840
//float4 voxelization_params_frustum_nf 3856
//float3 voxelization_params_camera_pos 3872
//float4x4 sc_ModelMatrixVoxelization 3888
//float correctedIntensity 3952
//float3x3 intensityTextureTransform 4016
//float4 intensityTextureUvMinMax 4064
//float4 intensityTextureBorderColor 4080
//int PreviewEnabled 4244
//float alphaTestThreshold 4252
//float2 size 4256
//float cornerRadius 4264
//float3x3 backgroundTransform 4320
//float4 backgroundUvMinMax 4368
//float4 backgroundBorderColor 4384
//float4 highlightColorStop2 4400
//float4 highlightColorStop1 4416
//float highlightStop1 4432
//float highlightStop2 4436
//float3x3 circleTextureTransform 4496
//float4 circleTextureUvMinMax 4544
//float4 circleTextureBorderColor 4560
//float2 cursorPosition 4576
//float4 highlightActiveColorStop2 4592
//float4 highlightActiveColorStop1 4608
//float isActive 4624
//float isHovered 4628
//bool borderOnly 4632
//bool cutOutCenter 4636
//float frameBorder 4640
//float4 grabZones 4656:[8]:16
//float grabZonesCount 4784
//float dotsHighlightStop1 4788
//float dotsHighlightStop2 4792
//float dotsScalar 4796
//float4 borderColor 4800
//float border 4816
//float borderSize 4820
//float edgeHighlightStop1 4824
//float edgeHighlightStop2 4828
//float opacityFactor 4832
//float Port_Input0_N008 4836
//float Port_Input1_N008 4840
//float Port_Input1_N032 4860
//float2 Port_Input1_N025 4864
//float Port_Input0_N010 4872
//float Port_Input0_N016 4876
//float Port_Input0_N017 4880
//float Port_Input1_N045 4884
//float2 Port_Input1_N040 4888
//float Port_Input0_N048 4896
//float Port_Input1_N048 4900
//float Port_Input1_N094 4904
//float Port_Input1_N050 4908
//float2 Port_Input1_N049 4912
//float2 Port_Input2_N049 4920
//float Port_Input1_N122 4928
//float Port_Input0_N043 4932
//float Port_Input0_N069 4936
//float Port_Input1_N068 4940
//float Port_borderSoftness_N007 4944
//float Port_Input1_N090 4948
//float Port_Input0_N119 4952
//float Port_Default_N117 4956
//}
//spec_const bool BLEND_MODE_AVERAGE 0 0
//spec_const bool BLEND_MODE_BRIGHT 1 0
//spec_const bool BLEND_MODE_COLOR_BURN 2 0
//spec_const bool BLEND_MODE_COLOR_DODGE 3 0
//spec_const bool BLEND_MODE_COLOR 4 0
//spec_const bool BLEND_MODE_DARKEN 5 0
//spec_const bool BLEND_MODE_DIFFERENCE 6 0
//spec_const bool BLEND_MODE_DIVIDE 7 0
//spec_const bool BLEND_MODE_DIVISION 8 0
//spec_const bool BLEND_MODE_EXCLUSION 9 0
//spec_const bool BLEND_MODE_FORGRAY 10 0
//spec_const bool BLEND_MODE_HARD_GLOW 11 0
//spec_const bool BLEND_MODE_HARD_LIGHT 12 0
//spec_const bool BLEND_MODE_HARD_MIX 13 0
//spec_const bool BLEND_MODE_HARD_PHOENIX 14 0
//spec_const bool BLEND_MODE_HARD_REFLECT 15 0
//spec_const bool BLEND_MODE_HUE 16 0
//spec_const bool BLEND_MODE_INTENSE 17 0
//spec_const bool BLEND_MODE_LIGHTEN 18 0
//spec_const bool BLEND_MODE_LINEAR_LIGHT 19 0
//spec_const bool BLEND_MODE_LUMINOSITY 20 0
//spec_const bool BLEND_MODE_NEGATION 21 0
//spec_const bool BLEND_MODE_NOTBRIGHT 22 0
//spec_const bool BLEND_MODE_OVERLAY 23 0
//spec_const bool BLEND_MODE_PIN_LIGHT 24 0
//spec_const bool BLEND_MODE_REALISTIC 25 0
//spec_const bool BLEND_MODE_SATURATION 26 0
//spec_const bool BLEND_MODE_SOFT_LIGHT 27 0
//spec_const bool BLEND_MODE_SUBTRACT 28 0
//spec_const bool BLEND_MODE_VIVID_LIGHT 29 0
//spec_const bool ENABLE_STIPPLE_PATTERN_TEST 30 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_background 31 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_circleTexture 32 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_intensityTexture 33 0
//spec_const bool SC_USE_UV_MIN_MAX_background 34 0
//spec_const bool SC_USE_UV_MIN_MAX_circleTexture 35 0
//spec_const bool SC_USE_UV_MIN_MAX_intensityTexture 36 0
//spec_const bool SC_USE_UV_TRANSFORM_background 37 0
//spec_const bool SC_USE_UV_TRANSFORM_circleTexture 38 0
//spec_const bool SC_USE_UV_TRANSFORM_intensityTexture 39 0
//spec_const bool UseViewSpaceDepthVariant 40 1
//spec_const bool backgroundHasSwappedViews 41 0
//spec_const bool circleTextureHasSwappedViews 42 0
//spec_const bool intensityTextureHasSwappedViews 43 0
//spec_const bool sc_BlendMode_AddWithAlphaFactor 44 0
//spec_const bool sc_BlendMode_Add 45 0
//spec_const bool sc_BlendMode_AlphaTest 46 0
//spec_const bool sc_BlendMode_AlphaToCoverage 47 0
//spec_const bool sc_BlendMode_ColoredGlass 48 0
//spec_const bool sc_BlendMode_Custom 49 0
//spec_const bool sc_BlendMode_Max 50 0
//spec_const bool sc_BlendMode_Min 51 0
//spec_const bool sc_BlendMode_MultiplyOriginal 52 0
//spec_const bool sc_BlendMode_Multiply 53 0
//spec_const bool sc_BlendMode_Normal 54 0
//spec_const bool sc_BlendMode_PremultipliedAlphaAuto 55 0
//spec_const bool sc_BlendMode_PremultipliedAlphaHardware 56 0
//spec_const bool sc_BlendMode_PremultipliedAlpha 57 0
//spec_const bool sc_BlendMode_Screen 58 0
//spec_const bool sc_DepthOnly 59 0
//spec_const bool sc_FramebufferFetch 60 0
//spec_const bool sc_MotionVectorsPass 61 0
//spec_const bool sc_OITCompositingPass 62 0
//spec_const bool sc_OITDepthBoundsPass 63 0
//spec_const bool sc_OITDepthGatherPass 64 0
//spec_const bool sc_OutputBounds 65 0
//spec_const bool sc_ProjectiveShadowsCaster 66 0
//spec_const bool sc_ProjectiveShadowsReceiver 67 0
//spec_const bool sc_RenderAlphaToColor 68 0
//spec_const bool sc_ScreenTextureHasSwappedViews 69 0
//spec_const bool sc_TAAEnabled 70 0
//spec_const bool sc_VertexBlendingUseNormals 71 0
//spec_const bool sc_VertexBlending 72 0
//spec_const bool sc_Voxelization 73 0
//spec_const int SC_SOFTWARE_WRAP_MODE_U_background 74 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_circleTexture 75 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_intensityTexture 76 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_background 77 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_circleTexture 78 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_intensityTexture 79 -1
//spec_const int backgroundLayout 80 0
//spec_const int circleTextureLayout 81 0
//spec_const int intensityTextureLayout 82 0
//spec_const int sc_DepthBufferMode 83 0
//spec_const int sc_RenderingSpace 84 -1
//spec_const int sc_ScreenTextureLayout 85 0
//spec_const int sc_ShaderCacheConstant 86 0
//spec_const int sc_SkinBonesCount 87 0
//spec_const int sc_StereoRenderingMode 88 0
//spec_const int sc_StereoRendering_IsClipDistanceEnabled 89 0
//SG_REFLECTION_END
constant bool BLEND_MODE_AVERAGE [[function_constant(0)]];
constant bool BLEND_MODE_AVERAGE_tmp = is_function_constant_defined(BLEND_MODE_AVERAGE) ? BLEND_MODE_AVERAGE : false;
constant bool BLEND_MODE_BRIGHT [[function_constant(1)]];
constant bool BLEND_MODE_BRIGHT_tmp = is_function_constant_defined(BLEND_MODE_BRIGHT) ? BLEND_MODE_BRIGHT : false;
constant bool BLEND_MODE_COLOR_BURN [[function_constant(2)]];
constant bool BLEND_MODE_COLOR_BURN_tmp = is_function_constant_defined(BLEND_MODE_COLOR_BURN) ? BLEND_MODE_COLOR_BURN : false;
constant bool BLEND_MODE_COLOR_DODGE [[function_constant(3)]];
constant bool BLEND_MODE_COLOR_DODGE_tmp = is_function_constant_defined(BLEND_MODE_COLOR_DODGE) ? BLEND_MODE_COLOR_DODGE : false;
constant bool BLEND_MODE_COLOR [[function_constant(4)]];
constant bool BLEND_MODE_COLOR_tmp = is_function_constant_defined(BLEND_MODE_COLOR) ? BLEND_MODE_COLOR : false;
constant bool BLEND_MODE_DARKEN [[function_constant(5)]];
constant bool BLEND_MODE_DARKEN_tmp = is_function_constant_defined(BLEND_MODE_DARKEN) ? BLEND_MODE_DARKEN : false;
constant bool BLEND_MODE_DIFFERENCE [[function_constant(6)]];
constant bool BLEND_MODE_DIFFERENCE_tmp = is_function_constant_defined(BLEND_MODE_DIFFERENCE) ? BLEND_MODE_DIFFERENCE : false;
constant bool BLEND_MODE_DIVIDE [[function_constant(7)]];
constant bool BLEND_MODE_DIVIDE_tmp = is_function_constant_defined(BLEND_MODE_DIVIDE) ? BLEND_MODE_DIVIDE : false;
constant bool BLEND_MODE_DIVISION [[function_constant(8)]];
constant bool BLEND_MODE_DIVISION_tmp = is_function_constant_defined(BLEND_MODE_DIVISION) ? BLEND_MODE_DIVISION : false;
constant bool BLEND_MODE_EXCLUSION [[function_constant(9)]];
constant bool BLEND_MODE_EXCLUSION_tmp = is_function_constant_defined(BLEND_MODE_EXCLUSION) ? BLEND_MODE_EXCLUSION : false;
constant bool BLEND_MODE_FORGRAY [[function_constant(10)]];
constant bool BLEND_MODE_FORGRAY_tmp = is_function_constant_defined(BLEND_MODE_FORGRAY) ? BLEND_MODE_FORGRAY : false;
constant bool BLEND_MODE_HARD_GLOW [[function_constant(11)]];
constant bool BLEND_MODE_HARD_GLOW_tmp = is_function_constant_defined(BLEND_MODE_HARD_GLOW) ? BLEND_MODE_HARD_GLOW : false;
constant bool BLEND_MODE_HARD_LIGHT [[function_constant(12)]];
constant bool BLEND_MODE_HARD_LIGHT_tmp = is_function_constant_defined(BLEND_MODE_HARD_LIGHT) ? BLEND_MODE_HARD_LIGHT : false;
constant bool BLEND_MODE_HARD_MIX [[function_constant(13)]];
constant bool BLEND_MODE_HARD_MIX_tmp = is_function_constant_defined(BLEND_MODE_HARD_MIX) ? BLEND_MODE_HARD_MIX : false;
constant bool BLEND_MODE_HARD_PHOENIX [[function_constant(14)]];
constant bool BLEND_MODE_HARD_PHOENIX_tmp = is_function_constant_defined(BLEND_MODE_HARD_PHOENIX) ? BLEND_MODE_HARD_PHOENIX : false;
constant bool BLEND_MODE_HARD_REFLECT [[function_constant(15)]];
constant bool BLEND_MODE_HARD_REFLECT_tmp = is_function_constant_defined(BLEND_MODE_HARD_REFLECT) ? BLEND_MODE_HARD_REFLECT : false;
constant bool BLEND_MODE_HUE [[function_constant(16)]];
constant bool BLEND_MODE_HUE_tmp = is_function_constant_defined(BLEND_MODE_HUE) ? BLEND_MODE_HUE : false;
constant bool BLEND_MODE_INTENSE [[function_constant(17)]];
constant bool BLEND_MODE_INTENSE_tmp = is_function_constant_defined(BLEND_MODE_INTENSE) ? BLEND_MODE_INTENSE : false;
constant bool BLEND_MODE_LIGHTEN [[function_constant(18)]];
constant bool BLEND_MODE_LIGHTEN_tmp = is_function_constant_defined(BLEND_MODE_LIGHTEN) ? BLEND_MODE_LIGHTEN : false;
constant bool BLEND_MODE_LINEAR_LIGHT [[function_constant(19)]];
constant bool BLEND_MODE_LINEAR_LIGHT_tmp = is_function_constant_defined(BLEND_MODE_LINEAR_LIGHT) ? BLEND_MODE_LINEAR_LIGHT : false;
constant bool BLEND_MODE_LUMINOSITY [[function_constant(20)]];
constant bool BLEND_MODE_LUMINOSITY_tmp = is_function_constant_defined(BLEND_MODE_LUMINOSITY) ? BLEND_MODE_LUMINOSITY : false;
constant bool BLEND_MODE_NEGATION [[function_constant(21)]];
constant bool BLEND_MODE_NEGATION_tmp = is_function_constant_defined(BLEND_MODE_NEGATION) ? BLEND_MODE_NEGATION : false;
constant bool BLEND_MODE_NOTBRIGHT [[function_constant(22)]];
constant bool BLEND_MODE_NOTBRIGHT_tmp = is_function_constant_defined(BLEND_MODE_NOTBRIGHT) ? BLEND_MODE_NOTBRIGHT : false;
constant bool BLEND_MODE_OVERLAY [[function_constant(23)]];
constant bool BLEND_MODE_OVERLAY_tmp = is_function_constant_defined(BLEND_MODE_OVERLAY) ? BLEND_MODE_OVERLAY : false;
constant bool BLEND_MODE_PIN_LIGHT [[function_constant(24)]];
constant bool BLEND_MODE_PIN_LIGHT_tmp = is_function_constant_defined(BLEND_MODE_PIN_LIGHT) ? BLEND_MODE_PIN_LIGHT : false;
constant bool BLEND_MODE_REALISTIC [[function_constant(25)]];
constant bool BLEND_MODE_REALISTIC_tmp = is_function_constant_defined(BLEND_MODE_REALISTIC) ? BLEND_MODE_REALISTIC : false;
constant bool BLEND_MODE_SATURATION [[function_constant(26)]];
constant bool BLEND_MODE_SATURATION_tmp = is_function_constant_defined(BLEND_MODE_SATURATION) ? BLEND_MODE_SATURATION : false;
constant bool BLEND_MODE_SOFT_LIGHT [[function_constant(27)]];
constant bool BLEND_MODE_SOFT_LIGHT_tmp = is_function_constant_defined(BLEND_MODE_SOFT_LIGHT) ? BLEND_MODE_SOFT_LIGHT : false;
constant bool BLEND_MODE_SUBTRACT [[function_constant(28)]];
constant bool BLEND_MODE_SUBTRACT_tmp = is_function_constant_defined(BLEND_MODE_SUBTRACT) ? BLEND_MODE_SUBTRACT : false;
constant bool BLEND_MODE_VIVID_LIGHT [[function_constant(29)]];
constant bool BLEND_MODE_VIVID_LIGHT_tmp = is_function_constant_defined(BLEND_MODE_VIVID_LIGHT) ? BLEND_MODE_VIVID_LIGHT : false;
constant bool ENABLE_STIPPLE_PATTERN_TEST [[function_constant(30)]];
constant bool ENABLE_STIPPLE_PATTERN_TEST_tmp = is_function_constant_defined(ENABLE_STIPPLE_PATTERN_TEST) ? ENABLE_STIPPLE_PATTERN_TEST : false;
constant bool SC_USE_CLAMP_TO_BORDER_background [[function_constant(31)]];
constant bool SC_USE_CLAMP_TO_BORDER_background_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_background) ? SC_USE_CLAMP_TO_BORDER_background : false;
constant bool SC_USE_CLAMP_TO_BORDER_circleTexture [[function_constant(32)]];
constant bool SC_USE_CLAMP_TO_BORDER_circleTexture_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_circleTexture) ? SC_USE_CLAMP_TO_BORDER_circleTexture : false;
constant bool SC_USE_CLAMP_TO_BORDER_intensityTexture [[function_constant(33)]];
constant bool SC_USE_CLAMP_TO_BORDER_intensityTexture_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_intensityTexture) ? SC_USE_CLAMP_TO_BORDER_intensityTexture : false;
constant bool SC_USE_UV_MIN_MAX_background [[function_constant(34)]];
constant bool SC_USE_UV_MIN_MAX_background_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_background) ? SC_USE_UV_MIN_MAX_background : false;
constant bool SC_USE_UV_MIN_MAX_circleTexture [[function_constant(35)]];
constant bool SC_USE_UV_MIN_MAX_circleTexture_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_circleTexture) ? SC_USE_UV_MIN_MAX_circleTexture : false;
constant bool SC_USE_UV_MIN_MAX_intensityTexture [[function_constant(36)]];
constant bool SC_USE_UV_MIN_MAX_intensityTexture_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_intensityTexture) ? SC_USE_UV_MIN_MAX_intensityTexture : false;
constant bool SC_USE_UV_TRANSFORM_background [[function_constant(37)]];
constant bool SC_USE_UV_TRANSFORM_background_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_background) ? SC_USE_UV_TRANSFORM_background : false;
constant bool SC_USE_UV_TRANSFORM_circleTexture [[function_constant(38)]];
constant bool SC_USE_UV_TRANSFORM_circleTexture_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_circleTexture) ? SC_USE_UV_TRANSFORM_circleTexture : false;
constant bool SC_USE_UV_TRANSFORM_intensityTexture [[function_constant(39)]];
constant bool SC_USE_UV_TRANSFORM_intensityTexture_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_intensityTexture) ? SC_USE_UV_TRANSFORM_intensityTexture : false;
constant bool UseViewSpaceDepthVariant [[function_constant(40)]];
constant bool UseViewSpaceDepthVariant_tmp = is_function_constant_defined(UseViewSpaceDepthVariant) ? UseViewSpaceDepthVariant : true;
constant bool backgroundHasSwappedViews [[function_constant(41)]];
constant bool backgroundHasSwappedViews_tmp = is_function_constant_defined(backgroundHasSwappedViews) ? backgroundHasSwappedViews : false;
constant bool circleTextureHasSwappedViews [[function_constant(42)]];
constant bool circleTextureHasSwappedViews_tmp = is_function_constant_defined(circleTextureHasSwappedViews) ? circleTextureHasSwappedViews : false;
constant bool intensityTextureHasSwappedViews [[function_constant(43)]];
constant bool intensityTextureHasSwappedViews_tmp = is_function_constant_defined(intensityTextureHasSwappedViews) ? intensityTextureHasSwappedViews : false;
constant bool sc_BlendMode_AddWithAlphaFactor [[function_constant(44)]];
constant bool sc_BlendMode_AddWithAlphaFactor_tmp = is_function_constant_defined(sc_BlendMode_AddWithAlphaFactor) ? sc_BlendMode_AddWithAlphaFactor : false;
constant bool sc_BlendMode_Add [[function_constant(45)]];
constant bool sc_BlendMode_Add_tmp = is_function_constant_defined(sc_BlendMode_Add) ? sc_BlendMode_Add : false;
constant bool sc_BlendMode_AlphaTest [[function_constant(46)]];
constant bool sc_BlendMode_AlphaTest_tmp = is_function_constant_defined(sc_BlendMode_AlphaTest) ? sc_BlendMode_AlphaTest : false;
constant bool sc_BlendMode_AlphaToCoverage [[function_constant(47)]];
constant bool sc_BlendMode_AlphaToCoverage_tmp = is_function_constant_defined(sc_BlendMode_AlphaToCoverage) ? sc_BlendMode_AlphaToCoverage : false;
constant bool sc_BlendMode_ColoredGlass [[function_constant(48)]];
constant bool sc_BlendMode_ColoredGlass_tmp = is_function_constant_defined(sc_BlendMode_ColoredGlass) ? sc_BlendMode_ColoredGlass : false;
constant bool sc_BlendMode_Custom [[function_constant(49)]];
constant bool sc_BlendMode_Custom_tmp = is_function_constant_defined(sc_BlendMode_Custom) ? sc_BlendMode_Custom : false;
constant bool sc_BlendMode_Max [[function_constant(50)]];
constant bool sc_BlendMode_Max_tmp = is_function_constant_defined(sc_BlendMode_Max) ? sc_BlendMode_Max : false;
constant bool sc_BlendMode_Min [[function_constant(51)]];
constant bool sc_BlendMode_Min_tmp = is_function_constant_defined(sc_BlendMode_Min) ? sc_BlendMode_Min : false;
constant bool sc_BlendMode_MultiplyOriginal [[function_constant(52)]];
constant bool sc_BlendMode_MultiplyOriginal_tmp = is_function_constant_defined(sc_BlendMode_MultiplyOriginal) ? sc_BlendMode_MultiplyOriginal : false;
constant bool sc_BlendMode_Multiply [[function_constant(53)]];
constant bool sc_BlendMode_Multiply_tmp = is_function_constant_defined(sc_BlendMode_Multiply) ? sc_BlendMode_Multiply : false;
constant bool sc_BlendMode_Normal [[function_constant(54)]];
constant bool sc_BlendMode_Normal_tmp = is_function_constant_defined(sc_BlendMode_Normal) ? sc_BlendMode_Normal : false;
constant bool sc_BlendMode_PremultipliedAlphaAuto [[function_constant(55)]];
constant bool sc_BlendMode_PremultipliedAlphaAuto_tmp = is_function_constant_defined(sc_BlendMode_PremultipliedAlphaAuto) ? sc_BlendMode_PremultipliedAlphaAuto : false;
constant bool sc_BlendMode_PremultipliedAlphaHardware [[function_constant(56)]];
constant bool sc_BlendMode_PremultipliedAlphaHardware_tmp = is_function_constant_defined(sc_BlendMode_PremultipliedAlphaHardware) ? sc_BlendMode_PremultipliedAlphaHardware : false;
constant bool sc_BlendMode_PremultipliedAlpha [[function_constant(57)]];
constant bool sc_BlendMode_PremultipliedAlpha_tmp = is_function_constant_defined(sc_BlendMode_PremultipliedAlpha) ? sc_BlendMode_PremultipliedAlpha : false;
constant bool sc_BlendMode_Screen [[function_constant(58)]];
constant bool sc_BlendMode_Screen_tmp = is_function_constant_defined(sc_BlendMode_Screen) ? sc_BlendMode_Screen : false;
constant bool sc_DepthOnly [[function_constant(59)]];
constant bool sc_DepthOnly_tmp = is_function_constant_defined(sc_DepthOnly) ? sc_DepthOnly : false;
constant bool sc_FramebufferFetch [[function_constant(60)]];
constant bool sc_FramebufferFetch_tmp = is_function_constant_defined(sc_FramebufferFetch) ? sc_FramebufferFetch : false;
constant bool sc_MotionVectorsPass [[function_constant(61)]];
constant bool sc_MotionVectorsPass_tmp = is_function_constant_defined(sc_MotionVectorsPass) ? sc_MotionVectorsPass : false;
constant bool sc_OITCompositingPass [[function_constant(62)]];
constant bool sc_OITCompositingPass_tmp = is_function_constant_defined(sc_OITCompositingPass) ? sc_OITCompositingPass : false;
constant bool sc_OITDepthBoundsPass [[function_constant(63)]];
constant bool sc_OITDepthBoundsPass_tmp = is_function_constant_defined(sc_OITDepthBoundsPass) ? sc_OITDepthBoundsPass : false;
constant bool sc_OITDepthGatherPass [[function_constant(64)]];
constant bool sc_OITDepthGatherPass_tmp = is_function_constant_defined(sc_OITDepthGatherPass) ? sc_OITDepthGatherPass : false;
constant bool sc_OutputBounds [[function_constant(65)]];
constant bool sc_OutputBounds_tmp = is_function_constant_defined(sc_OutputBounds) ? sc_OutputBounds : false;
constant bool sc_ProjectiveShadowsCaster [[function_constant(66)]];
constant bool sc_ProjectiveShadowsCaster_tmp = is_function_constant_defined(sc_ProjectiveShadowsCaster) ? sc_ProjectiveShadowsCaster : false;
constant bool sc_ProjectiveShadowsReceiver [[function_constant(67)]];
constant bool sc_ProjectiveShadowsReceiver_tmp = is_function_constant_defined(sc_ProjectiveShadowsReceiver) ? sc_ProjectiveShadowsReceiver : false;
constant bool sc_RenderAlphaToColor [[function_constant(68)]];
constant bool sc_RenderAlphaToColor_tmp = is_function_constant_defined(sc_RenderAlphaToColor) ? sc_RenderAlphaToColor : false;
constant bool sc_ScreenTextureHasSwappedViews [[function_constant(69)]];
constant bool sc_ScreenTextureHasSwappedViews_tmp = is_function_constant_defined(sc_ScreenTextureHasSwappedViews) ? sc_ScreenTextureHasSwappedViews : false;
constant bool sc_TAAEnabled [[function_constant(70)]];
constant bool sc_TAAEnabled_tmp = is_function_constant_defined(sc_TAAEnabled) ? sc_TAAEnabled : false;
constant bool sc_VertexBlendingUseNormals [[function_constant(71)]];
constant bool sc_VertexBlendingUseNormals_tmp = is_function_constant_defined(sc_VertexBlendingUseNormals) ? sc_VertexBlendingUseNormals : false;
constant bool sc_VertexBlending [[function_constant(72)]];
constant bool sc_VertexBlending_tmp = is_function_constant_defined(sc_VertexBlending) ? sc_VertexBlending : false;
constant bool sc_Voxelization [[function_constant(73)]];
constant bool sc_Voxelization_tmp = is_function_constant_defined(sc_Voxelization) ? sc_Voxelization : false;
constant int SC_SOFTWARE_WRAP_MODE_U_background [[function_constant(74)]];
constant int SC_SOFTWARE_WRAP_MODE_U_background_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_background) ? SC_SOFTWARE_WRAP_MODE_U_background : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_circleTexture [[function_constant(75)]];
constant int SC_SOFTWARE_WRAP_MODE_U_circleTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_circleTexture) ? SC_SOFTWARE_WRAP_MODE_U_circleTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_U_intensityTexture [[function_constant(76)]];
constant int SC_SOFTWARE_WRAP_MODE_U_intensityTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_intensityTexture) ? SC_SOFTWARE_WRAP_MODE_U_intensityTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_background [[function_constant(77)]];
constant int SC_SOFTWARE_WRAP_MODE_V_background_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_background) ? SC_SOFTWARE_WRAP_MODE_V_background : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_circleTexture [[function_constant(78)]];
constant int SC_SOFTWARE_WRAP_MODE_V_circleTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_circleTexture) ? SC_SOFTWARE_WRAP_MODE_V_circleTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_intensityTexture [[function_constant(79)]];
constant int SC_SOFTWARE_WRAP_MODE_V_intensityTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_intensityTexture) ? SC_SOFTWARE_WRAP_MODE_V_intensityTexture : -1;
constant int backgroundLayout [[function_constant(80)]];
constant int backgroundLayout_tmp = is_function_constant_defined(backgroundLayout) ? backgroundLayout : 0;
constant int circleTextureLayout [[function_constant(81)]];
constant int circleTextureLayout_tmp = is_function_constant_defined(circleTextureLayout) ? circleTextureLayout : 0;
constant int intensityTextureLayout [[function_constant(82)]];
constant int intensityTextureLayout_tmp = is_function_constant_defined(intensityTextureLayout) ? intensityTextureLayout : 0;
constant int sc_DepthBufferMode [[function_constant(83)]];
constant int sc_DepthBufferMode_tmp = is_function_constant_defined(sc_DepthBufferMode) ? sc_DepthBufferMode : 0;
constant int sc_RenderingSpace [[function_constant(84)]];
constant int sc_RenderingSpace_tmp = is_function_constant_defined(sc_RenderingSpace) ? sc_RenderingSpace : -1;
constant int sc_ScreenTextureLayout [[function_constant(85)]];
constant int sc_ScreenTextureLayout_tmp = is_function_constant_defined(sc_ScreenTextureLayout) ? sc_ScreenTextureLayout : 0;
constant int sc_ShaderCacheConstant [[function_constant(86)]];
constant int sc_ShaderCacheConstant_tmp = is_function_constant_defined(sc_ShaderCacheConstant) ? sc_ShaderCacheConstant : 0;
constant int sc_SkinBonesCount [[function_constant(87)]];
constant int sc_SkinBonesCount_tmp = is_function_constant_defined(sc_SkinBonesCount) ? sc_SkinBonesCount : 0;
constant int sc_StereoRenderingMode [[function_constant(88)]];
constant int sc_StereoRenderingMode_tmp = is_function_constant_defined(sc_StereoRenderingMode) ? sc_StereoRenderingMode : 0;
constant int sc_StereoRendering_IsClipDistanceEnabled [[function_constant(89)]];
constant int sc_StereoRendering_IsClipDistanceEnabled_tmp = is_function_constant_defined(sc_StereoRendering_IsClipDistanceEnabled) ? sc_StereoRendering_IsClipDistanceEnabled : 0;

namespace SNAP_VS {
struct sc_Vertex_t
{
float4 position;
float3 normal;
float3 tangent;
float2 texture0;
float2 texture1;
};
struct ssGlobals
{
float gTimeElapsed;
float gTimeDelta;
float gTimeElapsedShifted;
float4 VertexColor;
float3 SurfacePosition_ObjectSpace;
};
struct sc_PointLight_t
{
int falloffEnabled;
float falloffEndDistance;
float negRcpFalloffEndDistance4;
float angleScale;
float angleOffset;
float3 direction;
float3 position;
float4 color;
};
struct sc_DirectionalLight_t
{
float3 direction;
float4 color;
};
struct sc_AmbientLight_t
{
float3 color;
float intensity;
};
struct sc_SphericalGaussianLight_t
{
float3 color;
float sharpness;
float3 axis;
};
struct sc_LightEstimationData_t
{
sc_SphericalGaussianLight_t sg[12];
float3 ambientLight;
};
struct sc_Camera_t
{
float3 position;
float aspect;
float2 clipPlanes;
};
struct userUniformsObj
{
sc_PointLight_t sc_PointLights[3];
sc_DirectionalLight_t sc_DirectionalLights[5];
sc_AmbientLight_t sc_AmbientLights[3];
sc_LightEstimationData_t sc_LightEstimationData;
float4 sc_EnvmapDiffuseSize;
float4 sc_EnvmapDiffuseDims;
float4 sc_EnvmapDiffuseView;
float4 sc_EnvmapSpecularSize;
float4 sc_EnvmapSpecularDims;
float4 sc_EnvmapSpecularView;
float3 sc_EnvmapRotation;
float sc_EnvmapExposure;
float3 sc_Sh[9];
float sc_ShIntensity;
float4 sc_Time;
float4 sc_UniformConstants;
float4 sc_GeometryInfo;
float4x4 sc_ModelViewProjectionMatrixArray[2];
float4x4 sc_ModelViewProjectionMatrixInverseArray[2];
float4x4 sc_ViewProjectionMatrixArray[2];
float4x4 sc_ViewProjectionMatrixInverseArray[2];
float4x4 sc_ModelViewMatrixArray[2];
float4x4 sc_ModelViewMatrixInverseArray[2];
float3x3 sc_ViewNormalMatrixArray[2];
float3x3 sc_ViewNormalMatrixInverseArray[2];
float4x4 sc_ProjectionMatrixArray[2];
float4x4 sc_ProjectionMatrixInverseArray[2];
float4x4 sc_ViewMatrixArray[2];
float4x4 sc_ViewMatrixInverseArray[2];
float4x4 sc_PrevFrameViewProjectionMatrixArray[2];
float4x4 sc_ModelMatrix;
float4x4 sc_ModelMatrixInverse;
float3x3 sc_NormalMatrix;
float3x3 sc_NormalMatrixInverse;
float4x4 sc_PrevFrameModelMatrix;
float4x4 sc_PrevFrameModelMatrixInverse;
float3 sc_LocalAabbMin;
float3 sc_LocalAabbMax;
float3 sc_WorldAabbMin;
float3 sc_WorldAabbMax;
float4 sc_WindowToViewportTransform;
float4 sc_CurrentRenderTargetDims;
sc_Camera_t sc_Camera;
float sc_ShadowDensity;
float4 sc_ShadowColor;
float4x4 sc_ProjectorMatrix;
float shaderComplexityValue;
float4 weights0;
float4 weights1;
float4 weights2;
float4 sc_StereoClipPlanes[2];
int sc_FallbackInstanceID;
float2 sc_TAAJitterOffset;
float strandWidth;
float strandTaper;
float4 sc_StrandDataMapTextureSize;
float clumpInstanceCount;
float clumpRadius;
float clumpTipScale;
float hairstyleInstanceCount;
float hairstyleNoise;
float4 sc_ScreenTextureSize;
float4 sc_ScreenTextureDims;
float4 sc_ScreenTextureView;
float4 voxelization_params_0;
float4 voxelization_params_frustum_lrbt;
float4 voxelization_params_frustum_nf;
float3 voxelization_params_camera_pos;
float4x4 sc_ModelMatrixVoxelization;
float correctedIntensity;
float4 intensityTextureSize;
float4 intensityTextureDims;
float4 intensityTextureView;
float3x3 intensityTextureTransform;
float4 intensityTextureUvMinMax;
float4 intensityTextureBorderColor;
float reflBlurWidth;
float reflBlurMinRough;
float reflBlurMaxRough;
int overrideTimeEnabled;
float overrideTimeElapsed[32];
float overrideTimeDelta;
int PreviewEnabled;
int PreviewNodeID;
float alphaTestThreshold;
float2 size;
float cornerRadius;
float4 backgroundSize;
float4 backgroundDims;
float4 backgroundView;
float3x3 backgroundTransform;
float4 backgroundUvMinMax;
float4 backgroundBorderColor;
float4 highlightColorStop2;
float4 highlightColorStop1;
float highlightStop1;
float highlightStop2;
float4 circleTextureSize;
float4 circleTextureDims;
float4 circleTextureView;
float3x3 circleTextureTransform;
float4 circleTextureUvMinMax;
float4 circleTextureBorderColor;
float2 cursorPosition;
float4 highlightActiveColorStop2;
float4 highlightActiveColorStop1;
float isActive;
float isHovered;
int borderOnly;
int cutOutCenter;
float frameBorder;
float4 grabZones[8];
float grabZonesCount;
float dotsHighlightStop1;
float dotsHighlightStop2;
float dotsScalar;
float4 borderColor;
float border;
float borderSize;
float edgeHighlightStop1;
float edgeHighlightStop2;
float opacityFactor;
float Port_Input0_N008;
float Port_Input1_N008;
float2 Port_Import_N023;
float Port_Import_N024;
float Port_Input1_N032;
float2 Port_Input1_N025;
float Port_Input0_N010;
float Port_Input0_N016;
float Port_Input0_N017;
float Port_Input1_N045;
float2 Port_Input1_N040;
float Port_Input0_N048;
float Port_Input1_N048;
float Port_Input1_N094;
float Port_Input1_N050;
float2 Port_Input1_N049;
float2 Port_Input2_N049;
float Port_Input1_N122;
float Port_Input0_N043;
float Port_Input0_N069;
float Port_Input1_N068;
float Port_borderSoftness_N007;
float Port_Input1_N090;
float Port_Input0_N119;
float Port_Default_N117;
};
struct sc_Bone_t
{
float4 boneMatrix[3];
float4 normalMatrix[3];
};
struct sc_Bones_obj
{
sc_Bone_t sc_Bones[1];
};
struct ssPreviewInfo
{
float4 Color;
bool Saved;
};
struct sc_Set0
{
constant sc_Bones_obj* sc_BonesUBO [[id(0)]];
texture2d<float> background [[id(1)]];
texture2d<float> circleTexture [[id(2)]];
texture2d<float> intensityTexture [[id(3)]];
texture2d<float> sc_ScreenTexture [[id(15)]];
sampler backgroundSmpSC [[id(18)]];
sampler circleTextureSmpSC [[id(19)]];
sampler intensityTextureSmpSC [[id(20)]];
sampler sc_ScreenTextureSmpSC [[id(25)]];
constant userUniformsObj* UserUniforms [[id(28)]];
};
struct main_vert_out
{
float4 varPosAndMotion [[user(locn0)]];
float4 varNormalAndMotion [[user(locn1)]];
float4 varTangent [[user(locn2)]];
float4 varTex01 [[user(locn3)]];
float4 varScreenPos [[user(locn4)]];
float2 varScreenTexturePos [[user(locn5)]];
float varViewSpaceDepth [[user(locn6)]];
float2 varShadowTex [[user(locn7)]];
int varStereoViewID [[user(locn8)]];
float varClipDistance [[user(locn9)]];
float4 varColor [[user(locn10)]];
float4 PreviewVertexColor [[user(locn11)]];
float PreviewVertexSaved [[user(locn12)]];
float4 gl_Position [[position]];
};
struct main_vert_in
{
float4 position [[attribute(0)]];
float3 normal [[attribute(1)]];
float4 tangent [[attribute(2)]];
float2 texture0 [[attribute(3)]];
float2 texture1 [[attribute(4)]];
float4 boneData [[attribute(5)]];
float3 blendShape0Pos [[attribute(6)]];
float3 blendShape1Pos [[attribute(7)]];
float3 blendShape2Pos [[attribute(8)]];
float3 blendShape3Pos [[attribute(9)]];
float3 blendShape4Pos [[attribute(10)]];
float3 blendShape5Pos [[attribute(11)]];
float3 blendShape0Normal [[attribute(12)]];
float3 blendShape1Normal [[attribute(13)]];
float3 blendShape2Normal [[attribute(14)]];
float3 positionNext [[attribute(15)]];
float3 positionPrevious [[attribute(16)]];
float4 strandProperties [[attribute(17)]];
float4 color [[attribute(18)]];
};
vertex main_vert_out main_vert(main_vert_in in [[stage_in]],constant sc_Set0& sc_set0 [[buffer(0)]],uint gl_InstanceIndex [[instance_id]])
{
main_vert_out out={};
out.PreviewVertexColor=float4(0.5);
ssPreviewInfo PreviewInfo;
PreviewInfo.Color=float4(0.5);
PreviewInfo.Saved=false;
out.PreviewVertexSaved=0.0;
sc_Vertex_t l9_0;
l9_0.position=in.position;
l9_0.normal=in.normal;
l9_0.tangent=in.tangent.xyz;
l9_0.texture0=in.texture0;
l9_0.texture1=in.texture1;
sc_Vertex_t l9_1=l9_0;
sc_Vertex_t param=l9_1;
if ((int(sc_Voxelization_tmp)!=0))
{
sc_Vertex_t l9_2=param;
param=l9_2;
}
sc_Vertex_t l9_3=param;
if ((int(sc_VertexBlending_tmp)!=0))
{
if ((int(sc_VertexBlendingUseNormals_tmp)!=0))
{
sc_Vertex_t l9_4=l9_3;
float3 l9_5=in.blendShape0Pos;
float3 l9_6=in.blendShape0Normal;
float l9_7=(*sc_set0.UserUniforms).weights0.x;
sc_Vertex_t l9_8=l9_4;
float3 l9_9=l9_5;
float l9_10=l9_7;
float3 l9_11=l9_8.position.xyz+(l9_9*l9_10);
l9_8.position=float4(l9_11.x,l9_11.y,l9_11.z,l9_8.position.w);
l9_4=l9_8;
l9_4.normal+=(l9_6*l9_7);
l9_3=l9_4;
sc_Vertex_t l9_12=l9_3;
float3 l9_13=in.blendShape1Pos;
float3 l9_14=in.blendShape1Normal;
float l9_15=(*sc_set0.UserUniforms).weights0.y;
sc_Vertex_t l9_16=l9_12;
float3 l9_17=l9_13;
float l9_18=l9_15;
float3 l9_19=l9_16.position.xyz+(l9_17*l9_18);
l9_16.position=float4(l9_19.x,l9_19.y,l9_19.z,l9_16.position.w);
l9_12=l9_16;
l9_12.normal+=(l9_14*l9_15);
l9_3=l9_12;
sc_Vertex_t l9_20=l9_3;
float3 l9_21=in.blendShape2Pos;
float3 l9_22=in.blendShape2Normal;
float l9_23=(*sc_set0.UserUniforms).weights0.z;
sc_Vertex_t l9_24=l9_20;
float3 l9_25=l9_21;
float l9_26=l9_23;
float3 l9_27=l9_24.position.xyz+(l9_25*l9_26);
l9_24.position=float4(l9_27.x,l9_27.y,l9_27.z,l9_24.position.w);
l9_20=l9_24;
l9_20.normal+=(l9_22*l9_23);
l9_3=l9_20;
}
else
{
sc_Vertex_t l9_28=l9_3;
float3 l9_29=in.blendShape0Pos;
float l9_30=(*sc_set0.UserUniforms).weights0.x;
float3 l9_31=l9_28.position.xyz+(l9_29*l9_30);
l9_28.position=float4(l9_31.x,l9_31.y,l9_31.z,l9_28.position.w);
l9_3=l9_28;
sc_Vertex_t l9_32=l9_3;
float3 l9_33=in.blendShape1Pos;
float l9_34=(*sc_set0.UserUniforms).weights0.y;
float3 l9_35=l9_32.position.xyz+(l9_33*l9_34);
l9_32.position=float4(l9_35.x,l9_35.y,l9_35.z,l9_32.position.w);
l9_3=l9_32;
sc_Vertex_t l9_36=l9_3;
float3 l9_37=in.blendShape2Pos;
float l9_38=(*sc_set0.UserUniforms).weights0.z;
float3 l9_39=l9_36.position.xyz+(l9_37*l9_38);
l9_36.position=float4(l9_39.x,l9_39.y,l9_39.z,l9_36.position.w);
l9_3=l9_36;
sc_Vertex_t l9_40=l9_3;
float3 l9_41=in.blendShape3Pos;
float l9_42=(*sc_set0.UserUniforms).weights0.w;
float3 l9_43=l9_40.position.xyz+(l9_41*l9_42);
l9_40.position=float4(l9_43.x,l9_43.y,l9_43.z,l9_40.position.w);
l9_3=l9_40;
sc_Vertex_t l9_44=l9_3;
float3 l9_45=in.blendShape4Pos;
float l9_46=(*sc_set0.UserUniforms).weights1.x;
float3 l9_47=l9_44.position.xyz+(l9_45*l9_46);
l9_44.position=float4(l9_47.x,l9_47.y,l9_47.z,l9_44.position.w);
l9_3=l9_44;
sc_Vertex_t l9_48=l9_3;
float3 l9_49=in.blendShape5Pos;
float l9_50=(*sc_set0.UserUniforms).weights1.y;
float3 l9_51=l9_48.position.xyz+(l9_49*l9_50);
l9_48.position=float4(l9_51.x,l9_51.y,l9_51.z,l9_48.position.w);
l9_3=l9_48;
}
}
param=l9_3;
sc_Vertex_t l9_52=param;
if (sc_SkinBonesCount_tmp>0)
{
float4 l9_53=float4(0.0);
if (sc_SkinBonesCount_tmp>0)
{
l9_53=float4(1.0,fract(in.boneData.yzw));
l9_53.x-=dot(l9_53.yzw,float3(1.0));
}
float4 l9_54=l9_53;
float4 l9_55=l9_54;
int l9_56=int(in.boneData.x);
int l9_57=int(in.boneData.y);
int l9_58=int(in.boneData.z);
int l9_59=int(in.boneData.w);
int l9_60=l9_56;
float4 l9_61=l9_52.position;
float3 l9_62=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_63=l9_60;
float4 l9_64=(*sc_set0.sc_BonesUBO).sc_Bones[l9_63].boneMatrix[0];
float4 l9_65=(*sc_set0.sc_BonesUBO).sc_Bones[l9_63].boneMatrix[1];
float4 l9_66=(*sc_set0.sc_BonesUBO).sc_Bones[l9_63].boneMatrix[2];
float4 l9_67[3];
l9_67[0]=l9_64;
l9_67[1]=l9_65;
l9_67[2]=l9_66;
l9_62=float3(dot(l9_61,l9_67[0]),dot(l9_61,l9_67[1]),dot(l9_61,l9_67[2]));
}
else
{
l9_62=l9_61.xyz;
}
float3 l9_68=l9_62;
float3 l9_69=l9_68;
float l9_70=l9_55.x;
int l9_71=l9_57;
float4 l9_72=l9_52.position;
float3 l9_73=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_74=l9_71;
float4 l9_75=(*sc_set0.sc_BonesUBO).sc_Bones[l9_74].boneMatrix[0];
float4 l9_76=(*sc_set0.sc_BonesUBO).sc_Bones[l9_74].boneMatrix[1];
float4 l9_77=(*sc_set0.sc_BonesUBO).sc_Bones[l9_74].boneMatrix[2];
float4 l9_78[3];
l9_78[0]=l9_75;
l9_78[1]=l9_76;
l9_78[2]=l9_77;
l9_73=float3(dot(l9_72,l9_78[0]),dot(l9_72,l9_78[1]),dot(l9_72,l9_78[2]));
}
else
{
l9_73=l9_72.xyz;
}
float3 l9_79=l9_73;
float3 l9_80=l9_79;
float l9_81=l9_55.y;
int l9_82=l9_58;
float4 l9_83=l9_52.position;
float3 l9_84=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_85=l9_82;
float4 l9_86=(*sc_set0.sc_BonesUBO).sc_Bones[l9_85].boneMatrix[0];
float4 l9_87=(*sc_set0.sc_BonesUBO).sc_Bones[l9_85].boneMatrix[1];
float4 l9_88=(*sc_set0.sc_BonesUBO).sc_Bones[l9_85].boneMatrix[2];
float4 l9_89[3];
l9_89[0]=l9_86;
l9_89[1]=l9_87;
l9_89[2]=l9_88;
l9_84=float3(dot(l9_83,l9_89[0]),dot(l9_83,l9_89[1]),dot(l9_83,l9_89[2]));
}
else
{
l9_84=l9_83.xyz;
}
float3 l9_90=l9_84;
float3 l9_91=l9_90;
float l9_92=l9_55.z;
int l9_93=l9_59;
float4 l9_94=l9_52.position;
float3 l9_95=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_96=l9_93;
float4 l9_97=(*sc_set0.sc_BonesUBO).sc_Bones[l9_96].boneMatrix[0];
float4 l9_98=(*sc_set0.sc_BonesUBO).sc_Bones[l9_96].boneMatrix[1];
float4 l9_99=(*sc_set0.sc_BonesUBO).sc_Bones[l9_96].boneMatrix[2];
float4 l9_100[3];
l9_100[0]=l9_97;
l9_100[1]=l9_98;
l9_100[2]=l9_99;
l9_95=float3(dot(l9_94,l9_100[0]),dot(l9_94,l9_100[1]),dot(l9_94,l9_100[2]));
}
else
{
l9_95=l9_94.xyz;
}
float3 l9_101=l9_95;
float3 l9_102=(((l9_69*l9_70)+(l9_80*l9_81))+(l9_91*l9_92))+(l9_101*l9_55.w);
l9_52.position=float4(l9_102.x,l9_102.y,l9_102.z,l9_52.position.w);
int l9_103=l9_56;
float3x3 l9_104=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_103].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_103].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_103].normalMatrix[2].xyz));
float3x3 l9_105=l9_104;
float3x3 l9_106=l9_105;
int l9_107=l9_57;
float3x3 l9_108=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_107].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_107].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_107].normalMatrix[2].xyz));
float3x3 l9_109=l9_108;
float3x3 l9_110=l9_109;
int l9_111=l9_58;
float3x3 l9_112=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_111].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_111].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_111].normalMatrix[2].xyz));
float3x3 l9_113=l9_112;
float3x3 l9_114=l9_113;
int l9_115=l9_59;
float3x3 l9_116=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_115].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_115].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_115].normalMatrix[2].xyz));
float3x3 l9_117=l9_116;
float3x3 l9_118=l9_117;
l9_52.normal=((((l9_106*l9_52.normal)*l9_55.x)+((l9_110*l9_52.normal)*l9_55.y))+((l9_114*l9_52.normal)*l9_55.z))+((l9_118*l9_52.normal)*l9_55.w);
l9_52.tangent=((((l9_106*l9_52.tangent)*l9_55.x)+((l9_110*l9_52.tangent)*l9_55.y))+((l9_114*l9_52.tangent)*l9_55.z))+((l9_118*l9_52.tangent)*l9_55.w);
}
param=l9_52;
if (sc_RenderingSpace_tmp==3)
{
out.varPosAndMotion=float4(float3(0.0).x,float3(0.0).y,float3(0.0).z,out.varPosAndMotion.w);
out.varNormalAndMotion=float4(param.normal.x,param.normal.y,param.normal.z,out.varNormalAndMotion.w);
out.varTangent=float4(param.tangent.x,param.tangent.y,param.tangent.z,out.varTangent.w);
}
else
{
if (sc_RenderingSpace_tmp==4)
{
out.varPosAndMotion=float4(float3(0.0).x,float3(0.0).y,float3(0.0).z,out.varPosAndMotion.w);
out.varNormalAndMotion=float4(param.normal.x,param.normal.y,param.normal.z,out.varNormalAndMotion.w);
out.varTangent=float4(param.tangent.x,param.tangent.y,param.tangent.z,out.varTangent.w);
}
else
{
if (sc_RenderingSpace_tmp==2)
{
out.varPosAndMotion=float4(param.position.xyz.x,param.position.xyz.y,param.position.xyz.z,out.varPosAndMotion.w);
out.varNormalAndMotion=float4(param.normal.x,param.normal.y,param.normal.z,out.varNormalAndMotion.w);
out.varTangent=float4(param.tangent.x,param.tangent.y,param.tangent.z,out.varTangent.w);
}
else
{
if (sc_RenderingSpace_tmp==1)
{
float3 l9_119=((*sc_set0.UserUniforms).sc_ModelMatrix*param.position).xyz;
out.varPosAndMotion=float4(l9_119.x,l9_119.y,l9_119.z,out.varPosAndMotion.w);
float3 l9_120=(*sc_set0.UserUniforms).sc_NormalMatrix*param.normal;
out.varNormalAndMotion=float4(l9_120.x,l9_120.y,l9_120.z,out.varNormalAndMotion.w);
float3 l9_121=(*sc_set0.UserUniforms).sc_NormalMatrix*param.tangent;
out.varTangent=float4(l9_121.x,l9_121.y,l9_121.z,out.varTangent.w);
}
}
}
}
if ((*sc_set0.UserUniforms).PreviewEnabled==1)
{
param.texture0.x=1.0-param.texture0.x;
}
out.varColor=in.color;
sc_Vertex_t v=param;
ssGlobals Globals;
Globals.gTimeElapsed=(*sc_set0.UserUniforms).sc_Time.x;
Globals.gTimeDelta=(*sc_set0.UserUniforms).sc_Time.y;
Globals.VertexColor=out.varColor;
Globals.SurfacePosition_ObjectSpace=((*sc_set0.UserUniforms).sc_ModelMatrixInverse*float4(out.varPosAndMotion.xyz,1.0)).xyz;
float3 WorldPosition=out.varPosAndMotion.xyz;
float3 WorldNormal=out.varNormalAndMotion.xyz;
float3 WorldTangent=out.varTangent.xyz;
float4 Color_N0=float4(0.0);
Color_N0=Globals.VertexColor;
float Value1_N1=0.0;
float Value3_N1=0.0;
float4 param_1=Color_N0;
float param_2=param_1.x;
float param_3=param_1.z;
Value1_N1=param_2;
Value3_N1=param_3;
float Output_N8=0.0;
Output_N8=smoothstep((*sc_set0.UserUniforms).Port_Input0_N008,(*sc_set0.UserUniforms).Port_Input1_N008,Value3_N1);
float2 Output_N36=float2(0.0);
float2 param_4=(*sc_set0.UserUniforms).size;
Output_N36=param_4;
float2 Value_N23=float2(0.0);
Value_N23=Output_N36;
float Value1_N37=0.0;
float Value2_N37=0.0;
float2 param_5=Value_N23;
float param_6=param_5.x;
float param_7=param_5.y;
Value1_N37=param_6;
Value2_N37=param_7;
float2 Value_N14=float2(0.0);
Value_N14.x=Value1_N37;
Value_N14.y=Value2_N37;
float Output_N33=0.0;
float param_8=(*sc_set0.UserUniforms).cornerRadius;
Output_N33=param_8;
float Value_N24=0.0;
Value_N24=Output_N33;
float Output_N35=0.0;
Output_N35=Value_N24-1.0;
float Output_N32=0.0;
Output_N32=Output_N35*(*sc_set0.UserUniforms).Port_Input1_N032;
float2 Output_N34=float2(0.0);
Output_N34=Value_N14-float2(Output_N32);
float Value1_N15=0.0;
float Value2_N15=0.0;
float2 param_9=Output_N34;
float param_10=param_9.x;
float param_11=param_9.y;
Value1_N15=param_10;
Value2_N15=param_11;
float Output_N11=0.0;
Output_N11=Output_N8*Value1_N15;
float3 Position_N2=float3(0.0);
Position_N2=Globals.SurfacePosition_ObjectSpace;
float2 Value1_N30=float2(0.0);
float Value2_N30=0.0;
float3 param_12=Position_N2;
float2 param_13=param_12.xy;
float param_14=param_12.z;
Value1_N30=param_13;
Value2_N30=param_14;
float2 Output_N20=float2(0.0);
Output_N20=Value1_N30*float2(Value_N24);
float2 Output_N25=float2(0.0);
Output_N25=Output_N34*(*sc_set0.UserUniforms).Port_Input1_N025;
float2 Output_N27=float2(0.0);
Output_N27=Output_N20-Output_N25;
float3 Value_N29=float3(0.0);
Value_N29=float3(Output_N27.x,Output_N27.y,Value_N29.z);
Value_N29.z=Value2_N30;
float Value1_N3=0.0;
float Value2_N3=0.0;
float Value3_N3=0.0;
float3 param_15=Value_N29;
float param_16=param_15.x;
float param_17=param_15.y;
float param_18=param_15.z;
Value1_N3=param_16;
Value2_N3=param_17;
Value3_N3=param_18;
float Output_N12=0.0;
Output_N12=Output_N11+Value1_N3;
float Output_N10=0.0;
Output_N10=step((*sc_set0.UserUniforms).Port_Input0_N010,Value1_N1);
float Output_N6=0.0;
Output_N6=Output_N10*Value2_N15;
float Output_N9=0.0;
Output_N9=Output_N6+Value2_N3;
float3 Value_N5=float3(0.0);
Value_N5.x=Output_N12;
Value_N5.y=Output_N9;
Value_N5.z=Value3_N3;
float3 VectorOut_N28=float3(0.0);
VectorOut_N28=((*sc_set0.UserUniforms).sc_ModelMatrix*float4(Value_N5,1.0)).xyz;
float3 Export_N39=float3(0.0);
Export_N39=VectorOut_N28;
WorldPosition=Export_N39;
if ((*sc_set0.UserUniforms).PreviewEnabled==1)
{
WorldPosition=out.varPosAndMotion.xyz;
WorldNormal=out.varNormalAndMotion.xyz;
WorldTangent=out.varTangent.xyz;
}
sc_Vertex_t param_19=v;
float3 param_20=WorldPosition;
float3 param_21=WorldNormal;
float3 param_22=WorldTangent;
float4 param_23=v.position;
out.varPosAndMotion=float4(param_20.x,param_20.y,param_20.z,out.varPosAndMotion.w);
float3 l9_122=normalize(param_21);
out.varNormalAndMotion=float4(l9_122.x,l9_122.y,l9_122.z,out.varNormalAndMotion.w);
float3 l9_123=normalize(param_22);
out.varTangent=float4(l9_123.x,l9_123.y,l9_123.z,out.varTangent.w);
out.varTangent.w=in.tangent.w;
if ((int(UseViewSpaceDepthVariant_tmp)!=0)&&(((int(sc_OITDepthGatherPass_tmp)!=0)||(int(sc_OITCompositingPass_tmp)!=0))||(int(sc_OITDepthBoundsPass_tmp)!=0)))
{
float4 l9_124=param_19.position;
float4 l9_125=float4(0.0);
if (sc_RenderingSpace_tmp==3)
{
int l9_126=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_126=0;
}
else
{
l9_126=gl_InstanceIndex%2;
}
int l9_127=l9_126;
l9_125=(*sc_set0.UserUniforms).sc_ProjectionMatrixInverseArray[l9_127]*l9_124;
}
else
{
if (sc_RenderingSpace_tmp==2)
{
int l9_128=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_128=0;
}
else
{
l9_128=gl_InstanceIndex%2;
}
int l9_129=l9_128;
l9_125=(*sc_set0.UserUniforms).sc_ViewMatrixArray[l9_129]*l9_124;
}
else
{
if (sc_RenderingSpace_tmp==1)
{
int l9_130=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_130=0;
}
else
{
l9_130=gl_InstanceIndex%2;
}
int l9_131=l9_130;
l9_125=(*sc_set0.UserUniforms).sc_ModelViewMatrixArray[l9_131]*l9_124;
}
else
{
l9_125=l9_124;
}
}
}
float4 l9_132=l9_125;
out.varViewSpaceDepth=-l9_132.z;
}
float4 l9_133=float4(0.0);
if (sc_RenderingSpace_tmp==3)
{
l9_133=param_23;
}
else
{
if (sc_RenderingSpace_tmp==4)
{
int l9_134=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_134=0;
}
else
{
l9_134=gl_InstanceIndex%2;
}
int l9_135=l9_134;
l9_133=((*sc_set0.UserUniforms).sc_ModelViewMatrixArray[l9_135]*param_19.position)*float4(1.0/(*sc_set0.UserUniforms).sc_Camera.aspect,1.0,1.0,1.0);
}
else
{
if (sc_RenderingSpace_tmp==2)
{
int l9_136=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_136=0;
}
else
{
l9_136=gl_InstanceIndex%2;
}
int l9_137=l9_136;
l9_133=(*sc_set0.UserUniforms).sc_ViewProjectionMatrixArray[l9_137]*float4(out.varPosAndMotion.xyz,1.0);
}
else
{
if (sc_RenderingSpace_tmp==1)
{
int l9_138=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_138=0;
}
else
{
l9_138=gl_InstanceIndex%2;
}
int l9_139=l9_138;
l9_133=(*sc_set0.UserUniforms).sc_ViewProjectionMatrixArray[l9_139]*float4(out.varPosAndMotion.xyz,1.0);
}
}
}
}
out.varTex01=float4(param_19.texture0,param_19.texture1);
if ((int(sc_ProjectiveShadowsReceiver_tmp)!=0))
{
float4 l9_140=param_19.position;
float4 l9_141=l9_140;
if (sc_RenderingSpace_tmp==1)
{
l9_141=(*sc_set0.UserUniforms).sc_ModelMatrix*l9_140;
}
float4 l9_142=(*sc_set0.UserUniforms).sc_ProjectorMatrix*l9_141;
float2 l9_143=((l9_142.xy/float2(l9_142.w))*0.5)+float2(0.5);
out.varShadowTex=l9_143;
}
float4 l9_144=l9_133;
if (sc_DepthBufferMode_tmp==1)
{
int l9_145=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_145=0;
}
else
{
l9_145=gl_InstanceIndex%2;
}
int l9_146=l9_145;
if ((*sc_set0.UserUniforms).sc_ProjectionMatrixArray[l9_146][2].w!=0.0)
{
float l9_147=2.0/log2((*sc_set0.UserUniforms).sc_Camera.clipPlanes.y+1.0);
l9_144.z=((log2(fast::max((*sc_set0.UserUniforms).sc_Camera.clipPlanes.x,1.0+l9_144.w))*l9_147)-1.0)*l9_144.w;
}
}
float4 l9_148=l9_144;
l9_133=l9_148;
float4 l9_149=l9_133;
if ((int(sc_TAAEnabled_tmp)!=0))
{
float2 l9_150=l9_149.xy+((*sc_set0.UserUniforms).sc_TAAJitterOffset*l9_149.w);
l9_149=float4(l9_150.x,l9_150.y,l9_149.z,l9_149.w);
}
float4 l9_151=l9_149;
l9_133=l9_151;
float4 l9_152=l9_133;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_152.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_153=l9_152;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_154=dot(l9_153,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_155=l9_154;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_155;
}
}
float4 l9_156=float4(l9_152.x,-l9_152.y,(l9_152.z*0.5)+(l9_152.w*0.5),l9_152.w);
out.gl_Position=l9_156;
if ((int(sc_Voxelization_tmp)!=0))
{
sc_Vertex_t l9_158=param_19;
sc_Vertex_t l9_159=l9_158;
if ((int(sc_VertexBlending_tmp)!=0))
{
if ((int(sc_VertexBlendingUseNormals_tmp)!=0))
{
sc_Vertex_t l9_160=l9_159;
float3 l9_161=in.blendShape0Pos;
float3 l9_162=in.blendShape0Normal;
float l9_163=(*sc_set0.UserUniforms).weights0.x;
sc_Vertex_t l9_164=l9_160;
float3 l9_165=l9_161;
float l9_166=l9_163;
float3 l9_167=l9_164.position.xyz+(l9_165*l9_166);
l9_164.position=float4(l9_167.x,l9_167.y,l9_167.z,l9_164.position.w);
l9_160=l9_164;
l9_160.normal+=(l9_162*l9_163);
l9_159=l9_160;
sc_Vertex_t l9_168=l9_159;
float3 l9_169=in.blendShape1Pos;
float3 l9_170=in.blendShape1Normal;
float l9_171=(*sc_set0.UserUniforms).weights0.y;
sc_Vertex_t l9_172=l9_168;
float3 l9_173=l9_169;
float l9_174=l9_171;
float3 l9_175=l9_172.position.xyz+(l9_173*l9_174);
l9_172.position=float4(l9_175.x,l9_175.y,l9_175.z,l9_172.position.w);
l9_168=l9_172;
l9_168.normal+=(l9_170*l9_171);
l9_159=l9_168;
sc_Vertex_t l9_176=l9_159;
float3 l9_177=in.blendShape2Pos;
float3 l9_178=in.blendShape2Normal;
float l9_179=(*sc_set0.UserUniforms).weights0.z;
sc_Vertex_t l9_180=l9_176;
float3 l9_181=l9_177;
float l9_182=l9_179;
float3 l9_183=l9_180.position.xyz+(l9_181*l9_182);
l9_180.position=float4(l9_183.x,l9_183.y,l9_183.z,l9_180.position.w);
l9_176=l9_180;
l9_176.normal+=(l9_178*l9_179);
l9_159=l9_176;
}
else
{
sc_Vertex_t l9_184=l9_159;
float3 l9_185=in.blendShape0Pos;
float l9_186=(*sc_set0.UserUniforms).weights0.x;
float3 l9_187=l9_184.position.xyz+(l9_185*l9_186);
l9_184.position=float4(l9_187.x,l9_187.y,l9_187.z,l9_184.position.w);
l9_159=l9_184;
sc_Vertex_t l9_188=l9_159;
float3 l9_189=in.blendShape1Pos;
float l9_190=(*sc_set0.UserUniforms).weights0.y;
float3 l9_191=l9_188.position.xyz+(l9_189*l9_190);
l9_188.position=float4(l9_191.x,l9_191.y,l9_191.z,l9_188.position.w);
l9_159=l9_188;
sc_Vertex_t l9_192=l9_159;
float3 l9_193=in.blendShape2Pos;
float l9_194=(*sc_set0.UserUniforms).weights0.z;
float3 l9_195=l9_192.position.xyz+(l9_193*l9_194);
l9_192.position=float4(l9_195.x,l9_195.y,l9_195.z,l9_192.position.w);
l9_159=l9_192;
sc_Vertex_t l9_196=l9_159;
float3 l9_197=in.blendShape3Pos;
float l9_198=(*sc_set0.UserUniforms).weights0.w;
float3 l9_199=l9_196.position.xyz+(l9_197*l9_198);
l9_196.position=float4(l9_199.x,l9_199.y,l9_199.z,l9_196.position.w);
l9_159=l9_196;
sc_Vertex_t l9_200=l9_159;
float3 l9_201=in.blendShape4Pos;
float l9_202=(*sc_set0.UserUniforms).weights1.x;
float3 l9_203=l9_200.position.xyz+(l9_201*l9_202);
l9_200.position=float4(l9_203.x,l9_203.y,l9_203.z,l9_200.position.w);
l9_159=l9_200;
sc_Vertex_t l9_204=l9_159;
float3 l9_205=in.blendShape5Pos;
float l9_206=(*sc_set0.UserUniforms).weights1.y;
float3 l9_207=l9_204.position.xyz+(l9_205*l9_206);
l9_204.position=float4(l9_207.x,l9_207.y,l9_207.z,l9_204.position.w);
l9_159=l9_204;
}
}
l9_158=l9_159;
sc_Vertex_t l9_208=l9_158;
if (sc_SkinBonesCount_tmp>0)
{
float4 l9_209=float4(0.0);
if (sc_SkinBonesCount_tmp>0)
{
l9_209=float4(1.0,fract(in.boneData.yzw));
l9_209.x-=dot(l9_209.yzw,float3(1.0));
}
float4 l9_210=l9_209;
float4 l9_211=l9_210;
int l9_212=int(in.boneData.x);
int l9_213=int(in.boneData.y);
int l9_214=int(in.boneData.z);
int l9_215=int(in.boneData.w);
int l9_216=l9_212;
float4 l9_217=l9_208.position;
float3 l9_218=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_219=l9_216;
float4 l9_220=(*sc_set0.sc_BonesUBO).sc_Bones[l9_219].boneMatrix[0];
float4 l9_221=(*sc_set0.sc_BonesUBO).sc_Bones[l9_219].boneMatrix[1];
float4 l9_222=(*sc_set0.sc_BonesUBO).sc_Bones[l9_219].boneMatrix[2];
float4 l9_223[3];
l9_223[0]=l9_220;
l9_223[1]=l9_221;
l9_223[2]=l9_222;
l9_218=float3(dot(l9_217,l9_223[0]),dot(l9_217,l9_223[1]),dot(l9_217,l9_223[2]));
}
else
{
l9_218=l9_217.xyz;
}
float3 l9_224=l9_218;
float3 l9_225=l9_224;
float l9_226=l9_211.x;
int l9_227=l9_213;
float4 l9_228=l9_208.position;
float3 l9_229=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_230=l9_227;
float4 l9_231=(*sc_set0.sc_BonesUBO).sc_Bones[l9_230].boneMatrix[0];
float4 l9_232=(*sc_set0.sc_BonesUBO).sc_Bones[l9_230].boneMatrix[1];
float4 l9_233=(*sc_set0.sc_BonesUBO).sc_Bones[l9_230].boneMatrix[2];
float4 l9_234[3];
l9_234[0]=l9_231;
l9_234[1]=l9_232;
l9_234[2]=l9_233;
l9_229=float3(dot(l9_228,l9_234[0]),dot(l9_228,l9_234[1]),dot(l9_228,l9_234[2]));
}
else
{
l9_229=l9_228.xyz;
}
float3 l9_235=l9_229;
float3 l9_236=l9_235;
float l9_237=l9_211.y;
int l9_238=l9_214;
float4 l9_239=l9_208.position;
float3 l9_240=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_241=l9_238;
float4 l9_242=(*sc_set0.sc_BonesUBO).sc_Bones[l9_241].boneMatrix[0];
float4 l9_243=(*sc_set0.sc_BonesUBO).sc_Bones[l9_241].boneMatrix[1];
float4 l9_244=(*sc_set0.sc_BonesUBO).sc_Bones[l9_241].boneMatrix[2];
float4 l9_245[3];
l9_245[0]=l9_242;
l9_245[1]=l9_243;
l9_245[2]=l9_244;
l9_240=float3(dot(l9_239,l9_245[0]),dot(l9_239,l9_245[1]),dot(l9_239,l9_245[2]));
}
else
{
l9_240=l9_239.xyz;
}
float3 l9_246=l9_240;
float3 l9_247=l9_246;
float l9_248=l9_211.z;
int l9_249=l9_215;
float4 l9_250=l9_208.position;
float3 l9_251=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_252=l9_249;
float4 l9_253=(*sc_set0.sc_BonesUBO).sc_Bones[l9_252].boneMatrix[0];
float4 l9_254=(*sc_set0.sc_BonesUBO).sc_Bones[l9_252].boneMatrix[1];
float4 l9_255=(*sc_set0.sc_BonesUBO).sc_Bones[l9_252].boneMatrix[2];
float4 l9_256[3];
l9_256[0]=l9_253;
l9_256[1]=l9_254;
l9_256[2]=l9_255;
l9_251=float3(dot(l9_250,l9_256[0]),dot(l9_250,l9_256[1]),dot(l9_250,l9_256[2]));
}
else
{
l9_251=l9_250.xyz;
}
float3 l9_257=l9_251;
float3 l9_258=(((l9_225*l9_226)+(l9_236*l9_237))+(l9_247*l9_248))+(l9_257*l9_211.w);
l9_208.position=float4(l9_258.x,l9_258.y,l9_258.z,l9_208.position.w);
int l9_259=l9_212;
float3x3 l9_260=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_259].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_259].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_259].normalMatrix[2].xyz));
float3x3 l9_261=l9_260;
float3x3 l9_262=l9_261;
int l9_263=l9_213;
float3x3 l9_264=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_263].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_263].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_263].normalMatrix[2].xyz));
float3x3 l9_265=l9_264;
float3x3 l9_266=l9_265;
int l9_267=l9_214;
float3x3 l9_268=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_267].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_267].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_267].normalMatrix[2].xyz));
float3x3 l9_269=l9_268;
float3x3 l9_270=l9_269;
int l9_271=l9_215;
float3x3 l9_272=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_271].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_271].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_271].normalMatrix[2].xyz));
float3x3 l9_273=l9_272;
float3x3 l9_274=l9_273;
l9_208.normal=((((l9_262*l9_208.normal)*l9_211.x)+((l9_266*l9_208.normal)*l9_211.y))+((l9_270*l9_208.normal)*l9_211.z))+((l9_274*l9_208.normal)*l9_211.w);
l9_208.tangent=((((l9_262*l9_208.tangent)*l9_211.x)+((l9_266*l9_208.tangent)*l9_211.y))+((l9_270*l9_208.tangent)*l9_211.z))+((l9_274*l9_208.tangent)*l9_211.w);
}
l9_158=l9_208;
float l9_275=(*sc_set0.UserUniforms).voxelization_params_0.y;
float l9_276=(*sc_set0.UserUniforms).voxelization_params_0.z;
float l9_277=(*sc_set0.UserUniforms).voxelization_params_0.w;
float l9_278=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.x;
float l9_279=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.y;
float l9_280=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.z;
float l9_281=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.w;
float l9_282=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.x;
float l9_283=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.y;
float3 l9_284=(*sc_set0.UserUniforms).voxelization_params_camera_pos;
float l9_285=l9_275/l9_276;
int l9_286=gl_InstanceIndex;
int l9_287=l9_286;
l9_158.position=(*sc_set0.UserUniforms).sc_ModelMatrixVoxelization*l9_158.position;
float3 l9_288=l9_158.position.xyz;
float3 l9_289=float3(float(l9_287%int(l9_277))*l9_275,float(l9_287/int(l9_277))*l9_275,(float(l9_287)*l9_285)+l9_282);
float3 l9_290=l9_288+l9_289;
float4 l9_291=float4(l9_290-l9_284,1.0);
float l9_292=l9_278;
float l9_293=l9_279;
float l9_294=l9_280;
float l9_295=l9_281;
float l9_296=l9_282;
float l9_297=l9_283;
float4x4 l9_298=float4x4(float4(2.0/(l9_293-l9_292),0.0,0.0,(-(l9_293+l9_292))/(l9_293-l9_292)),float4(0.0,2.0/(l9_295-l9_294),0.0,(-(l9_295+l9_294))/(l9_295-l9_294)),float4(0.0,0.0,(-2.0)/(l9_297-l9_296),(-(l9_297+l9_296))/(l9_297-l9_296)),float4(0.0,0.0,0.0,1.0));
float4x4 l9_299=l9_298;
float4 l9_300=l9_299*l9_291;
l9_300.w=1.0;
out.varScreenPos=l9_300;
float4 l9_301=l9_300*1.0;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_301.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_302=l9_301;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_303=dot(l9_302,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_304=l9_303;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_304;
}
}
float4 l9_305=float4(l9_301.x,-l9_301.y,(l9_301.z*0.5)+(l9_301.w*0.5),l9_301.w);
out.gl_Position=l9_305;
param_19=l9_158;
}
else
{
if ((int(sc_OutputBounds_tmp)!=0))
{
sc_Vertex_t l9_306=param_19;
sc_Vertex_t l9_307=l9_306;
if ((int(sc_VertexBlending_tmp)!=0))
{
if ((int(sc_VertexBlendingUseNormals_tmp)!=0))
{
sc_Vertex_t l9_308=l9_307;
float3 l9_309=in.blendShape0Pos;
float3 l9_310=in.blendShape0Normal;
float l9_311=(*sc_set0.UserUniforms).weights0.x;
sc_Vertex_t l9_312=l9_308;
float3 l9_313=l9_309;
float l9_314=l9_311;
float3 l9_315=l9_312.position.xyz+(l9_313*l9_314);
l9_312.position=float4(l9_315.x,l9_315.y,l9_315.z,l9_312.position.w);
l9_308=l9_312;
l9_308.normal+=(l9_310*l9_311);
l9_307=l9_308;
sc_Vertex_t l9_316=l9_307;
float3 l9_317=in.blendShape1Pos;
float3 l9_318=in.blendShape1Normal;
float l9_319=(*sc_set0.UserUniforms).weights0.y;
sc_Vertex_t l9_320=l9_316;
float3 l9_321=l9_317;
float l9_322=l9_319;
float3 l9_323=l9_320.position.xyz+(l9_321*l9_322);
l9_320.position=float4(l9_323.x,l9_323.y,l9_323.z,l9_320.position.w);
l9_316=l9_320;
l9_316.normal+=(l9_318*l9_319);
l9_307=l9_316;
sc_Vertex_t l9_324=l9_307;
float3 l9_325=in.blendShape2Pos;
float3 l9_326=in.blendShape2Normal;
float l9_327=(*sc_set0.UserUniforms).weights0.z;
sc_Vertex_t l9_328=l9_324;
float3 l9_329=l9_325;
float l9_330=l9_327;
float3 l9_331=l9_328.position.xyz+(l9_329*l9_330);
l9_328.position=float4(l9_331.x,l9_331.y,l9_331.z,l9_328.position.w);
l9_324=l9_328;
l9_324.normal+=(l9_326*l9_327);
l9_307=l9_324;
}
else
{
sc_Vertex_t l9_332=l9_307;
float3 l9_333=in.blendShape0Pos;
float l9_334=(*sc_set0.UserUniforms).weights0.x;
float3 l9_335=l9_332.position.xyz+(l9_333*l9_334);
l9_332.position=float4(l9_335.x,l9_335.y,l9_335.z,l9_332.position.w);
l9_307=l9_332;
sc_Vertex_t l9_336=l9_307;
float3 l9_337=in.blendShape1Pos;
float l9_338=(*sc_set0.UserUniforms).weights0.y;
float3 l9_339=l9_336.position.xyz+(l9_337*l9_338);
l9_336.position=float4(l9_339.x,l9_339.y,l9_339.z,l9_336.position.w);
l9_307=l9_336;
sc_Vertex_t l9_340=l9_307;
float3 l9_341=in.blendShape2Pos;
float l9_342=(*sc_set0.UserUniforms).weights0.z;
float3 l9_343=l9_340.position.xyz+(l9_341*l9_342);
l9_340.position=float4(l9_343.x,l9_343.y,l9_343.z,l9_340.position.w);
l9_307=l9_340;
sc_Vertex_t l9_344=l9_307;
float3 l9_345=in.blendShape3Pos;
float l9_346=(*sc_set0.UserUniforms).weights0.w;
float3 l9_347=l9_344.position.xyz+(l9_345*l9_346);
l9_344.position=float4(l9_347.x,l9_347.y,l9_347.z,l9_344.position.w);
l9_307=l9_344;
sc_Vertex_t l9_348=l9_307;
float3 l9_349=in.blendShape4Pos;
float l9_350=(*sc_set0.UserUniforms).weights1.x;
float3 l9_351=l9_348.position.xyz+(l9_349*l9_350);
l9_348.position=float4(l9_351.x,l9_351.y,l9_351.z,l9_348.position.w);
l9_307=l9_348;
sc_Vertex_t l9_352=l9_307;
float3 l9_353=in.blendShape5Pos;
float l9_354=(*sc_set0.UserUniforms).weights1.y;
float3 l9_355=l9_352.position.xyz+(l9_353*l9_354);
l9_352.position=float4(l9_355.x,l9_355.y,l9_355.z,l9_352.position.w);
l9_307=l9_352;
}
}
l9_306=l9_307;
sc_Vertex_t l9_356=l9_306;
if (sc_SkinBonesCount_tmp>0)
{
float4 l9_357=float4(0.0);
if (sc_SkinBonesCount_tmp>0)
{
l9_357=float4(1.0,fract(in.boneData.yzw));
l9_357.x-=dot(l9_357.yzw,float3(1.0));
}
float4 l9_358=l9_357;
float4 l9_359=l9_358;
int l9_360=int(in.boneData.x);
int l9_361=int(in.boneData.y);
int l9_362=int(in.boneData.z);
int l9_363=int(in.boneData.w);
int l9_364=l9_360;
float4 l9_365=l9_356.position;
float3 l9_366=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_367=l9_364;
float4 l9_368=(*sc_set0.sc_BonesUBO).sc_Bones[l9_367].boneMatrix[0];
float4 l9_369=(*sc_set0.sc_BonesUBO).sc_Bones[l9_367].boneMatrix[1];
float4 l9_370=(*sc_set0.sc_BonesUBO).sc_Bones[l9_367].boneMatrix[2];
float4 l9_371[3];
l9_371[0]=l9_368;
l9_371[1]=l9_369;
l9_371[2]=l9_370;
l9_366=float3(dot(l9_365,l9_371[0]),dot(l9_365,l9_371[1]),dot(l9_365,l9_371[2]));
}
else
{
l9_366=l9_365.xyz;
}
float3 l9_372=l9_366;
float3 l9_373=l9_372;
float l9_374=l9_359.x;
int l9_375=l9_361;
float4 l9_376=l9_356.position;
float3 l9_377=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_378=l9_375;
float4 l9_379=(*sc_set0.sc_BonesUBO).sc_Bones[l9_378].boneMatrix[0];
float4 l9_380=(*sc_set0.sc_BonesUBO).sc_Bones[l9_378].boneMatrix[1];
float4 l9_381=(*sc_set0.sc_BonesUBO).sc_Bones[l9_378].boneMatrix[2];
float4 l9_382[3];
l9_382[0]=l9_379;
l9_382[1]=l9_380;
l9_382[2]=l9_381;
l9_377=float3(dot(l9_376,l9_382[0]),dot(l9_376,l9_382[1]),dot(l9_376,l9_382[2]));
}
else
{
l9_377=l9_376.xyz;
}
float3 l9_383=l9_377;
float3 l9_384=l9_383;
float l9_385=l9_359.y;
int l9_386=l9_362;
float4 l9_387=l9_356.position;
float3 l9_388=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_389=l9_386;
float4 l9_390=(*sc_set0.sc_BonesUBO).sc_Bones[l9_389].boneMatrix[0];
float4 l9_391=(*sc_set0.sc_BonesUBO).sc_Bones[l9_389].boneMatrix[1];
float4 l9_392=(*sc_set0.sc_BonesUBO).sc_Bones[l9_389].boneMatrix[2];
float4 l9_393[3];
l9_393[0]=l9_390;
l9_393[1]=l9_391;
l9_393[2]=l9_392;
l9_388=float3(dot(l9_387,l9_393[0]),dot(l9_387,l9_393[1]),dot(l9_387,l9_393[2]));
}
else
{
l9_388=l9_387.xyz;
}
float3 l9_394=l9_388;
float3 l9_395=l9_394;
float l9_396=l9_359.z;
int l9_397=l9_363;
float4 l9_398=l9_356.position;
float3 l9_399=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_400=l9_397;
float4 l9_401=(*sc_set0.sc_BonesUBO).sc_Bones[l9_400].boneMatrix[0];
float4 l9_402=(*sc_set0.sc_BonesUBO).sc_Bones[l9_400].boneMatrix[1];
float4 l9_403=(*sc_set0.sc_BonesUBO).sc_Bones[l9_400].boneMatrix[2];
float4 l9_404[3];
l9_404[0]=l9_401;
l9_404[1]=l9_402;
l9_404[2]=l9_403;
l9_399=float3(dot(l9_398,l9_404[0]),dot(l9_398,l9_404[1]),dot(l9_398,l9_404[2]));
}
else
{
l9_399=l9_398.xyz;
}
float3 l9_405=l9_399;
float3 l9_406=(((l9_373*l9_374)+(l9_384*l9_385))+(l9_395*l9_396))+(l9_405*l9_359.w);
l9_356.position=float4(l9_406.x,l9_406.y,l9_406.z,l9_356.position.w);
int l9_407=l9_360;
float3x3 l9_408=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_407].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_407].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_407].normalMatrix[2].xyz));
float3x3 l9_409=l9_408;
float3x3 l9_410=l9_409;
int l9_411=l9_361;
float3x3 l9_412=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_411].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_411].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_411].normalMatrix[2].xyz));
float3x3 l9_413=l9_412;
float3x3 l9_414=l9_413;
int l9_415=l9_362;
float3x3 l9_416=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_415].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_415].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_415].normalMatrix[2].xyz));
float3x3 l9_417=l9_416;
float3x3 l9_418=l9_417;
int l9_419=l9_363;
float3x3 l9_420=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_419].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_419].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_419].normalMatrix[2].xyz));
float3x3 l9_421=l9_420;
float3x3 l9_422=l9_421;
l9_356.normal=((((l9_410*l9_356.normal)*l9_359.x)+((l9_414*l9_356.normal)*l9_359.y))+((l9_418*l9_356.normal)*l9_359.z))+((l9_422*l9_356.normal)*l9_359.w);
l9_356.tangent=((((l9_410*l9_356.tangent)*l9_359.x)+((l9_414*l9_356.tangent)*l9_359.y))+((l9_418*l9_356.tangent)*l9_359.z))+((l9_422*l9_356.tangent)*l9_359.w);
}
l9_306=l9_356;
float3 l9_423=(*sc_set0.UserUniforms).voxelization_params_camera_pos;
float2 l9_424=((l9_306.position.xy/float2(l9_306.position.w))*0.5)+float2(0.5);
out.varTex01=float4(l9_424.x,l9_424.y,out.varTex01.z,out.varTex01.w);
l9_306.position=(*sc_set0.UserUniforms).sc_ModelMatrixVoxelization*l9_306.position;
float3 l9_425=l9_306.position.xyz-l9_423;
l9_306.position=float4(l9_425.x,l9_425.y,l9_425.z,l9_306.position.w);
out.varPosAndMotion=float4(l9_306.position.xyz.x,l9_306.position.xyz.y,l9_306.position.xyz.z,out.varPosAndMotion.w);
float3 l9_426=normalize(l9_306.normal);
out.varNormalAndMotion=float4(l9_426.x,l9_426.y,l9_426.z,out.varNormalAndMotion.w);
float l9_427=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.x;
float l9_428=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.y;
float l9_429=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.z;
float l9_430=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.w;
float l9_431=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.x;
float l9_432=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.y;
float l9_433=l9_427;
float l9_434=l9_428;
float l9_435=l9_429;
float l9_436=l9_430;
float l9_437=l9_431;
float l9_438=l9_432;
float4x4 l9_439=float4x4(float4(2.0/(l9_434-l9_433),0.0,0.0,(-(l9_434+l9_433))/(l9_434-l9_433)),float4(0.0,2.0/(l9_436-l9_435),0.0,(-(l9_436+l9_435))/(l9_436-l9_435)),float4(0.0,0.0,(-2.0)/(l9_438-l9_437),(-(l9_438+l9_437))/(l9_438-l9_437)),float4(0.0,0.0,0.0,1.0));
float4x4 l9_440=l9_439;
float4 l9_441=float4(0.0);
float3 l9_442=(l9_440*l9_306.position).xyz;
l9_441=float4(l9_442.x,l9_442.y,l9_442.z,l9_441.w);
l9_441.w=1.0;
out.varScreenPos=l9_441;
float4 l9_443=l9_441*1.0;
float4 l9_444=l9_443;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_444.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_445=l9_444;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_446=dot(l9_445,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_447=l9_446;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_447;
}
}
float4 l9_448=float4(l9_444.x,-l9_444.y,(l9_444.z*0.5)+(l9_444.w*0.5),l9_444.w);
out.gl_Position=l9_448;
param_19=l9_306;
}
}
v=param_19;
float3 param_24=out.varPosAndMotion.xyz;
if ((int(sc_MotionVectorsPass_tmp)!=0))
{
float4 l9_449=((*sc_set0.UserUniforms).sc_PrevFrameModelMatrix*(*sc_set0.UserUniforms).sc_ModelMatrixInverse)*float4(param_24,1.0);
float3 l9_450=param_24;
float3 l9_451=l9_449.xyz;
if ((int(sc_MotionVectorsPass_tmp)!=0))
{
int l9_452=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_452=0;
}
else
{
l9_452=gl_InstanceIndex%2;
}
int l9_453=l9_452;
float4 l9_454=(*sc_set0.UserUniforms).sc_ViewProjectionMatrixArray[l9_453]*float4(l9_450,1.0);
float2 l9_455=l9_454.xy/float2(l9_454.w);
l9_454=float4(l9_455.x,l9_455.y,l9_454.z,l9_454.w);
int l9_456=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_456=0;
}
else
{
l9_456=gl_InstanceIndex%2;
}
int l9_457=l9_456;
float4 l9_458=(*sc_set0.UserUniforms).sc_PrevFrameViewProjectionMatrixArray[l9_457]*float4(l9_451,1.0);
float2 l9_459=l9_458.xy/float2(l9_458.w);
l9_458=float4(l9_459.x,l9_459.y,l9_458.z,l9_458.w);
float2 l9_460=(l9_454.xy-l9_458.xy)*0.5;
out.varPosAndMotion.w=l9_460.x;
out.varNormalAndMotion.w=l9_460.y;
}
}
if (PreviewInfo.Saved)
{
out.PreviewVertexColor=float4(PreviewInfo.Color.xyz,1.0);
out.PreviewVertexSaved=1.0;
}
return out;
}
} // VERTEX SHADER


namespace SNAP_FS {
struct ssGlobals
{
float gTimeElapsed;
float gTimeDelta;
float gTimeElapsedShifted;
float3 SurfacePosition_ObjectSpace;
};
struct sc_PointLight_t
{
int falloffEnabled;
float falloffEndDistance;
float negRcpFalloffEndDistance4;
float angleScale;
float angleOffset;
float3 direction;
float3 position;
float4 color;
};
struct sc_DirectionalLight_t
{
float3 direction;
float4 color;
};
struct sc_AmbientLight_t
{
float3 color;
float intensity;
};
struct sc_SphericalGaussianLight_t
{
float3 color;
float sharpness;
float3 axis;
};
struct sc_LightEstimationData_t
{
sc_SphericalGaussianLight_t sg[12];
float3 ambientLight;
};
struct sc_Camera_t
{
float3 position;
float aspect;
float2 clipPlanes;
};
struct userUniformsObj
{
sc_PointLight_t sc_PointLights[3];
sc_DirectionalLight_t sc_DirectionalLights[5];
sc_AmbientLight_t sc_AmbientLights[3];
sc_LightEstimationData_t sc_LightEstimationData;
float4 sc_EnvmapDiffuseSize;
float4 sc_EnvmapDiffuseDims;
float4 sc_EnvmapDiffuseView;
float4 sc_EnvmapSpecularSize;
float4 sc_EnvmapSpecularDims;
float4 sc_EnvmapSpecularView;
float3 sc_EnvmapRotation;
float sc_EnvmapExposure;
float3 sc_Sh[9];
float sc_ShIntensity;
float4 sc_Time;
float4 sc_UniformConstants;
float4 sc_GeometryInfo;
float4x4 sc_ModelViewProjectionMatrixArray[2];
float4x4 sc_ModelViewProjectionMatrixInverseArray[2];
float4x4 sc_ViewProjectionMatrixArray[2];
float4x4 sc_ViewProjectionMatrixInverseArray[2];
float4x4 sc_ModelViewMatrixArray[2];
float4x4 sc_ModelViewMatrixInverseArray[2];
float3x3 sc_ViewNormalMatrixArray[2];
float3x3 sc_ViewNormalMatrixInverseArray[2];
float4x4 sc_ProjectionMatrixArray[2];
float4x4 sc_ProjectionMatrixInverseArray[2];
float4x4 sc_ViewMatrixArray[2];
float4x4 sc_ViewMatrixInverseArray[2];
float4x4 sc_PrevFrameViewProjectionMatrixArray[2];
float4x4 sc_ModelMatrix;
float4x4 sc_ModelMatrixInverse;
float3x3 sc_NormalMatrix;
float3x3 sc_NormalMatrixInverse;
float4x4 sc_PrevFrameModelMatrix;
float4x4 sc_PrevFrameModelMatrixInverse;
float3 sc_LocalAabbMin;
float3 sc_LocalAabbMax;
float3 sc_WorldAabbMin;
float3 sc_WorldAabbMax;
float4 sc_WindowToViewportTransform;
float4 sc_CurrentRenderTargetDims;
sc_Camera_t sc_Camera;
float sc_ShadowDensity;
float4 sc_ShadowColor;
float4x4 sc_ProjectorMatrix;
float shaderComplexityValue;
float4 weights0;
float4 weights1;
float4 weights2;
float4 sc_StereoClipPlanes[2];
int sc_FallbackInstanceID;
float2 sc_TAAJitterOffset;
float strandWidth;
float strandTaper;
float4 sc_StrandDataMapTextureSize;
float clumpInstanceCount;
float clumpRadius;
float clumpTipScale;
float hairstyleInstanceCount;
float hairstyleNoise;
float4 sc_ScreenTextureSize;
float4 sc_ScreenTextureDims;
float4 sc_ScreenTextureView;
float4 voxelization_params_0;
float4 voxelization_params_frustum_lrbt;
float4 voxelization_params_frustum_nf;
float3 voxelization_params_camera_pos;
float4x4 sc_ModelMatrixVoxelization;
float correctedIntensity;
float4 intensityTextureSize;
float4 intensityTextureDims;
float4 intensityTextureView;
float3x3 intensityTextureTransform;
float4 intensityTextureUvMinMax;
float4 intensityTextureBorderColor;
float reflBlurWidth;
float reflBlurMinRough;
float reflBlurMaxRough;
int overrideTimeEnabled;
float overrideTimeElapsed[32];
float overrideTimeDelta;
int PreviewEnabled;
int PreviewNodeID;
float alphaTestThreshold;
float2 size;
float cornerRadius;
float4 backgroundSize;
float4 backgroundDims;
float4 backgroundView;
float3x3 backgroundTransform;
float4 backgroundUvMinMax;
float4 backgroundBorderColor;
float4 highlightColorStop2;
float4 highlightColorStop1;
float highlightStop1;
float highlightStop2;
float4 circleTextureSize;
float4 circleTextureDims;
float4 circleTextureView;
float3x3 circleTextureTransform;
float4 circleTextureUvMinMax;
float4 circleTextureBorderColor;
float2 cursorPosition;
float4 highlightActiveColorStop2;
float4 highlightActiveColorStop1;
float isActive;
float isHovered;
int borderOnly;
int cutOutCenter;
float frameBorder;
float4 grabZones[8];
float grabZonesCount;
float dotsHighlightStop1;
float dotsHighlightStop2;
float dotsScalar;
float4 borderColor;
float border;
float borderSize;
float edgeHighlightStop1;
float edgeHighlightStop2;
float opacityFactor;
float Port_Input0_N008;
float Port_Input1_N008;
float2 Port_Import_N023;
float Port_Import_N024;
float Port_Input1_N032;
float2 Port_Input1_N025;
float Port_Input0_N010;
float Port_Input0_N016;
float Port_Input0_N017;
float Port_Input1_N045;
float2 Port_Input1_N040;
float Port_Input0_N048;
float Port_Input1_N048;
float Port_Input1_N094;
float Port_Input1_N050;
float2 Port_Input1_N049;
float2 Port_Input2_N049;
float Port_Input1_N122;
float Port_Input0_N043;
float Port_Input0_N069;
float Port_Input1_N068;
float Port_borderSoftness_N007;
float Port_Input1_N090;
float Port_Input0_N119;
float Port_Default_N117;
};
struct ssPreviewInfo
{
float4 Color;
bool Saved;
};
struct sc_Bone_t
{
float4 boneMatrix[3];
float4 normalMatrix[3];
};
struct sc_Bones_obj
{
sc_Bone_t sc_Bones[1];
};
struct sc_Set0
{
constant sc_Bones_obj* sc_BonesUBO [[id(0)]];
texture2d<float> background [[id(1)]];
texture2d<float> circleTexture [[id(2)]];
texture2d<float> intensityTexture [[id(3)]];
texture2d<float> sc_ScreenTexture [[id(15)]];
sampler backgroundSmpSC [[id(18)]];
sampler circleTextureSmpSC [[id(19)]];
sampler intensityTextureSmpSC [[id(20)]];
sampler sc_ScreenTextureSmpSC [[id(25)]];
constant userUniformsObj* UserUniforms [[id(28)]];
};
struct main_frag_out
{
float4 sc_FragData0 [[color(0)]];
};
struct main_frag_in
{
float4 varPosAndMotion [[user(locn0)]];
float4 varNormalAndMotion [[user(locn1)]];
float4 varTangent [[user(locn2)]];
float4 varTex01 [[user(locn3)]];
float4 varScreenPos [[user(locn4)]];
float2 varScreenTexturePos [[user(locn5)]];
float varViewSpaceDepth [[user(locn6)]];
float2 varShadowTex [[user(locn7)]];
int varStereoViewID [[user(locn8)]];
float varClipDistance [[user(locn9)]];
float4 varColor [[user(locn10)]];
float4 PreviewVertexColor [[user(locn11)]];
float PreviewVertexSaved [[user(locn12)]];
};
// Implementation of the GLSL mod() function,which is slightly different than Metal fmod()
template<typename Tx,typename Ty>
Tx mod(Tx x,Ty y)
{
return x-y*floor(x/y);
}
float transformSingleColor(thread const float& original,thread const float& intMap,thread const float& target)
{
if (((int(BLEND_MODE_REALISTIC_tmp)!=0)||(int(BLEND_MODE_FORGRAY_tmp)!=0))||(int(BLEND_MODE_NOTBRIGHT_tmp)!=0))
{
return original/pow(1.0-target,intMap);
}
else
{
if ((int(BLEND_MODE_DIVISION_tmp)!=0))
{
return original/(1.0-target);
}
else
{
if ((int(BLEND_MODE_BRIGHT_tmp)!=0))
{
return original/pow(1.0-target,2.0-(2.0*original));
}
}
}
return 0.0;
}
float3 transformColor(thread const float& yValue,thread const float3& original,thread const float3& target,thread const float& weight,thread const float& intMap)
{
if ((int(BLEND_MODE_INTENSE_tmp)!=0))
{
float3 param=original;
float3 l9_0=param;
float4 l9_1;
if (l9_0.y<l9_0.z)
{
l9_1=float4(l9_0.zy,-1.0,0.66666669);
}
else
{
l9_1=float4(l9_0.yz,0.0,-0.33333334);
}
float4 l9_2=l9_1;
float4 l9_3;
if (l9_0.x<l9_2.x)
{
l9_3=float4(l9_2.xyw,l9_0.x);
}
else
{
l9_3=float4(l9_0.x,l9_2.yzx);
}
float4 l9_4=l9_3;
float l9_5=l9_4.x-fast::min(l9_4.w,l9_4.y);
float l9_6=abs(((l9_4.w-l9_4.y)/((6.0*l9_5)+1e-07))+l9_4.z);
float l9_7=l9_4.x;
float3 l9_8=float3(l9_6,l9_5,l9_7);
float3 l9_9=l9_8;
float l9_10=l9_9.z-(l9_9.y*0.5);
float l9_11=l9_9.y/((1.0-abs((2.0*l9_10)-1.0))+1e-07);
float3 l9_12=float3(l9_9.x,l9_11,l9_10);
float3 hslOrig=l9_12;
float3 res=float3(0.0);
res.x=target.x;
res.y=target.y;
res.z=hslOrig.z;
float3 param_1=res;
float l9_13=param_1.x;
float l9_14=abs((6.0*l9_13)-3.0)-1.0;
float l9_15=2.0-abs((6.0*l9_13)-2.0);
float l9_16=2.0-abs((6.0*l9_13)-4.0);
float3 l9_17=fast::clamp(float3(l9_14,l9_15,l9_16),float3(0.0),float3(1.0));
float3 l9_18=l9_17;
float l9_19=(1.0-abs((2.0*param_1.z)-1.0))*param_1.y;
l9_18=((l9_18-float3(0.5))*l9_19)+float3(param_1.z);
float3 l9_20=l9_18;
res=l9_20;
float3 resColor=mix(original,res,float3(weight));
return resColor;
}
else
{
float3 tmpColor=float3(0.0);
float param_2=yValue;
float param_3=intMap;
float param_4=target.x;
tmpColor.x=transformSingleColor(param_2,param_3,param_4);
float param_5=yValue;
float param_6=intMap;
float param_7=target.y;
tmpColor.y=transformSingleColor(param_5,param_6,param_7);
float param_8=yValue;
float param_9=intMap;
float param_10=target.z;
tmpColor.z=transformSingleColor(param_8,param_9,param_10);
tmpColor=fast::clamp(tmpColor,float3(0.0),float3(1.0));
float3 resColor_1=mix(original,tmpColor,float3(weight));
return resColor_1;
}
}
float3 definedBlend(thread const float3& a,thread const float3& b,thread int& varStereoViewID,constant userUniformsObj& UserUniforms,thread texture2d<float> intensityTexture,thread sampler intensityTextureSmpSC)
{
if ((int(BLEND_MODE_LIGHTEN_tmp)!=0))
{
return fast::max(a,b);
}
else
{
if ((int(BLEND_MODE_DARKEN_tmp)!=0))
{
return fast::min(a,b);
}
else
{
if ((int(BLEND_MODE_DIVIDE_tmp)!=0))
{
return b/a;
}
else
{
if ((int(BLEND_MODE_AVERAGE_tmp)!=0))
{
return (a+b)*0.5;
}
else
{
if ((int(BLEND_MODE_SUBTRACT_tmp)!=0))
{
return fast::max((a+b)-float3(1.0),float3(0.0));
}
else
{
if ((int(BLEND_MODE_DIFFERENCE_tmp)!=0))
{
return abs(a-b);
}
else
{
if ((int(BLEND_MODE_NEGATION_tmp)!=0))
{
return float3(1.0)-abs((float3(1.0)-a)-b);
}
else
{
if ((int(BLEND_MODE_EXCLUSION_tmp)!=0))
{
return (a+b)-((a*2.0)*b);
}
else
{
if ((int(BLEND_MODE_OVERLAY_tmp)!=0))
{
float l9_0;
if (a.x<0.5)
{
l9_0=(2.0*a.x)*b.x;
}
else
{
l9_0=1.0-((2.0*(1.0-a.x))*(1.0-b.x));
}
float l9_1=l9_0;
float l9_2;
if (a.y<0.5)
{
l9_2=(2.0*a.y)*b.y;
}
else
{
l9_2=1.0-((2.0*(1.0-a.y))*(1.0-b.y));
}
float l9_3=l9_2;
float l9_4;
if (a.z<0.5)
{
l9_4=(2.0*a.z)*b.z;
}
else
{
l9_4=1.0-((2.0*(1.0-a.z))*(1.0-b.z));
}
return float3(l9_1,l9_3,l9_4);
}
else
{
if ((int(BLEND_MODE_SOFT_LIGHT_tmp)!=0))
{
return (((float3(1.0)-(b*2.0))*a)*a)+((a*2.0)*b);
}
else
{
if ((int(BLEND_MODE_HARD_LIGHT_tmp)!=0))
{
float l9_5;
if (b.x<0.5)
{
l9_5=(2.0*b.x)*a.x;
}
else
{
l9_5=1.0-((2.0*(1.0-b.x))*(1.0-a.x));
}
float l9_6=l9_5;
float l9_7;
if (b.y<0.5)
{
l9_7=(2.0*b.y)*a.y;
}
else
{
l9_7=1.0-((2.0*(1.0-b.y))*(1.0-a.y));
}
float l9_8=l9_7;
float l9_9;
if (b.z<0.5)
{
l9_9=(2.0*b.z)*a.z;
}
else
{
l9_9=1.0-((2.0*(1.0-b.z))*(1.0-a.z));
}
return float3(l9_6,l9_8,l9_9);
}
else
{
if ((int(BLEND_MODE_COLOR_DODGE_tmp)!=0))
{
float l9_10;
if (b.x==1.0)
{
l9_10=b.x;
}
else
{
l9_10=fast::min(a.x/(1.0-b.x),1.0);
}
float l9_11=l9_10;
float l9_12;
if (b.y==1.0)
{
l9_12=b.y;
}
else
{
l9_12=fast::min(a.y/(1.0-b.y),1.0);
}
float l9_13=l9_12;
float l9_14;
if (b.z==1.0)
{
l9_14=b.z;
}
else
{
l9_14=fast::min(a.z/(1.0-b.z),1.0);
}
return float3(l9_11,l9_13,l9_14);
}
else
{
if ((int(BLEND_MODE_COLOR_BURN_tmp)!=0))
{
float l9_15;
if (b.x==0.0)
{
l9_15=b.x;
}
else
{
l9_15=fast::max(1.0-((1.0-a.x)/b.x),0.0);
}
float l9_16=l9_15;
float l9_17;
if (b.y==0.0)
{
l9_17=b.y;
}
else
{
l9_17=fast::max(1.0-((1.0-a.y)/b.y),0.0);
}
float l9_18=l9_17;
float l9_19;
if (b.z==0.0)
{
l9_19=b.z;
}
else
{
l9_19=fast::max(1.0-((1.0-a.z)/b.z),0.0);
}
return float3(l9_16,l9_18,l9_19);
}
else
{
if ((int(BLEND_MODE_LINEAR_LIGHT_tmp)!=0))
{
float l9_20;
if (b.x<0.5)
{
l9_20=fast::max((a.x+(2.0*b.x))-1.0,0.0);
}
else
{
l9_20=fast::min(a.x+(2.0*(b.x-0.5)),1.0);
}
float l9_21=l9_20;
float l9_22;
if (b.y<0.5)
{
l9_22=fast::max((a.y+(2.0*b.y))-1.0,0.0);
}
else
{
l9_22=fast::min(a.y+(2.0*(b.y-0.5)),1.0);
}
float l9_23=l9_22;
float l9_24;
if (b.z<0.5)
{
l9_24=fast::max((a.z+(2.0*b.z))-1.0,0.0);
}
else
{
l9_24=fast::min(a.z+(2.0*(b.z-0.5)),1.0);
}
return float3(l9_21,l9_23,l9_24);
}
else
{
if ((int(BLEND_MODE_VIVID_LIGHT_tmp)!=0))
{
float l9_25;
if (b.x<0.5)
{
float l9_26;
if ((2.0*b.x)==0.0)
{
l9_26=2.0*b.x;
}
else
{
l9_26=fast::max(1.0-((1.0-a.x)/(2.0*b.x)),0.0);
}
l9_25=l9_26;
}
else
{
float l9_27;
if ((2.0*(b.x-0.5))==1.0)
{
l9_27=2.0*(b.x-0.5);
}
else
{
l9_27=fast::min(a.x/(1.0-(2.0*(b.x-0.5))),1.0);
}
l9_25=l9_27;
}
float l9_28=l9_25;
float l9_29;
if (b.y<0.5)
{
float l9_30;
if ((2.0*b.y)==0.0)
{
l9_30=2.0*b.y;
}
else
{
l9_30=fast::max(1.0-((1.0-a.y)/(2.0*b.y)),0.0);
}
l9_29=l9_30;
}
else
{
float l9_31;
if ((2.0*(b.y-0.5))==1.0)
{
l9_31=2.0*(b.y-0.5);
}
else
{
l9_31=fast::min(a.y/(1.0-(2.0*(b.y-0.5))),1.0);
}
l9_29=l9_31;
}
float l9_32=l9_29;
float l9_33;
if (b.z<0.5)
{
float l9_34;
if ((2.0*b.z)==0.0)
{
l9_34=2.0*b.z;
}
else
{
l9_34=fast::max(1.0-((1.0-a.z)/(2.0*b.z)),0.0);
}
l9_33=l9_34;
}
else
{
float l9_35;
if ((2.0*(b.z-0.5))==1.0)
{
l9_35=2.0*(b.z-0.5);
}
else
{
l9_35=fast::min(a.z/(1.0-(2.0*(b.z-0.5))),1.0);
}
l9_33=l9_35;
}
return float3(l9_28,l9_32,l9_33);
}
else
{
if ((int(BLEND_MODE_PIN_LIGHT_tmp)!=0))
{
float l9_36;
if (b.x<0.5)
{
l9_36=fast::min(a.x,2.0*b.x);
}
else
{
l9_36=fast::max(a.x,2.0*(b.x-0.5));
}
float l9_37=l9_36;
float l9_38;
if (b.y<0.5)
{
l9_38=fast::min(a.y,2.0*b.y);
}
else
{
l9_38=fast::max(a.y,2.0*(b.y-0.5));
}
float l9_39=l9_38;
float l9_40;
if (b.z<0.5)
{
l9_40=fast::min(a.z,2.0*b.z);
}
else
{
l9_40=fast::max(a.z,2.0*(b.z-0.5));
}
return float3(l9_37,l9_39,l9_40);
}
else
{
if ((int(BLEND_MODE_HARD_MIX_tmp)!=0))
{
float l9_41;
if (b.x<0.5)
{
float l9_42;
if ((2.0*b.x)==0.0)
{
l9_42=2.0*b.x;
}
else
{
l9_42=fast::max(1.0-((1.0-a.x)/(2.0*b.x)),0.0);
}
l9_41=l9_42;
}
else
{
float l9_43;
if ((2.0*(b.x-0.5))==1.0)
{
l9_43=2.0*(b.x-0.5);
}
else
{
l9_43=fast::min(a.x/(1.0-(2.0*(b.x-0.5))),1.0);
}
l9_41=l9_43;
}
float l9_44=l9_41;
float l9_45;
if (b.y<0.5)
{
float l9_46;
if ((2.0*b.y)==0.0)
{
l9_46=2.0*b.y;
}
else
{
l9_46=fast::max(1.0-((1.0-a.y)/(2.0*b.y)),0.0);
}
l9_45=l9_46;
}
else
{
float l9_47;
if ((2.0*(b.y-0.5))==1.0)
{
l9_47=2.0*(b.y-0.5);
}
else
{
l9_47=fast::min(a.y/(1.0-(2.0*(b.y-0.5))),1.0);
}
l9_45=l9_47;
}
float l9_48=l9_45;
float l9_49;
if (b.z<0.5)
{
float l9_50;
if ((2.0*b.z)==0.0)
{
l9_50=2.0*b.z;
}
else
{
l9_50=fast::max(1.0-((1.0-a.z)/(2.0*b.z)),0.0);
}
l9_49=l9_50;
}
else
{
float l9_51;
if ((2.0*(b.z-0.5))==1.0)
{
l9_51=2.0*(b.z-0.5);
}
else
{
l9_51=fast::min(a.z/(1.0-(2.0*(b.z-0.5))),1.0);
}
l9_49=l9_51;
}
return float3((l9_44<0.5) ? 0.0 : 1.0,(l9_48<0.5) ? 0.0 : 1.0,(l9_49<0.5) ? 0.0 : 1.0);
}
else
{
if ((int(BLEND_MODE_HARD_REFLECT_tmp)!=0))
{
float l9_52;
if (b.x==1.0)
{
l9_52=b.x;
}
else
{
l9_52=fast::min((a.x*a.x)/(1.0-b.x),1.0);
}
float l9_53=l9_52;
float l9_54;
if (b.y==1.0)
{
l9_54=b.y;
}
else
{
l9_54=fast::min((a.y*a.y)/(1.0-b.y),1.0);
}
float l9_55=l9_54;
float l9_56;
if (b.z==1.0)
{
l9_56=b.z;
}
else
{
l9_56=fast::min((a.z*a.z)/(1.0-b.z),1.0);
}
return float3(l9_53,l9_55,l9_56);
}
else
{
if ((int(BLEND_MODE_HARD_GLOW_tmp)!=0))
{
float l9_57;
if (a.x==1.0)
{
l9_57=a.x;
}
else
{
l9_57=fast::min((b.x*b.x)/(1.0-a.x),1.0);
}
float l9_58=l9_57;
float l9_59;
if (a.y==1.0)
{
l9_59=a.y;
}
else
{
l9_59=fast::min((b.y*b.y)/(1.0-a.y),1.0);
}
float l9_60=l9_59;
float l9_61;
if (a.z==1.0)
{
l9_61=a.z;
}
else
{
l9_61=fast::min((b.z*b.z)/(1.0-a.z),1.0);
}
return float3(l9_58,l9_60,l9_61);
}
else
{
if ((int(BLEND_MODE_HARD_PHOENIX_tmp)!=0))
{
return (fast::min(a,b)-fast::max(a,b))+float3(1.0);
}
else
{
if ((int(BLEND_MODE_HUE_tmp)!=0))
{
float3 param=a;
float3 param_1=b;
float3 l9_62=param;
float3 l9_63=l9_62;
float4 l9_64;
if (l9_63.y<l9_63.z)
{
l9_64=float4(l9_63.zy,-1.0,0.66666669);
}
else
{
l9_64=float4(l9_63.yz,0.0,-0.33333334);
}
float4 l9_65=l9_64;
float4 l9_66;
if (l9_63.x<l9_65.x)
{
l9_66=float4(l9_65.xyw,l9_63.x);
}
else
{
l9_66=float4(l9_63.x,l9_65.yzx);
}
float4 l9_67=l9_66;
float l9_68=l9_67.x-fast::min(l9_67.w,l9_67.y);
float l9_69=abs(((l9_67.w-l9_67.y)/((6.0*l9_68)+1e-07))+l9_67.z);
float l9_70=l9_67.x;
float3 l9_71=float3(l9_69,l9_68,l9_70);
float3 l9_72=l9_71;
float l9_73=l9_72.z-(l9_72.y*0.5);
float l9_74=l9_72.y/((1.0-abs((2.0*l9_73)-1.0))+1e-07);
float3 l9_75=float3(l9_72.x,l9_74,l9_73);
float3 l9_76=l9_75;
float3 l9_77=param_1;
float3 l9_78=l9_77;
float4 l9_79;
if (l9_78.y<l9_78.z)
{
l9_79=float4(l9_78.zy,-1.0,0.66666669);
}
else
{
l9_79=float4(l9_78.yz,0.0,-0.33333334);
}
float4 l9_80=l9_79;
float4 l9_81;
if (l9_78.x<l9_80.x)
{
l9_81=float4(l9_80.xyw,l9_78.x);
}
else
{
l9_81=float4(l9_78.x,l9_80.yzx);
}
float4 l9_82=l9_81;
float l9_83=l9_82.x-fast::min(l9_82.w,l9_82.y);
float l9_84=abs(((l9_82.w-l9_82.y)/((6.0*l9_83)+1e-07))+l9_82.z);
float l9_85=l9_82.x;
float3 l9_86=float3(l9_84,l9_83,l9_85);
float3 l9_87=l9_86;
float l9_88=l9_87.z-(l9_87.y*0.5);
float l9_89=l9_87.y/((1.0-abs((2.0*l9_88)-1.0))+1e-07);
float3 l9_90=float3(l9_87.x,l9_89,l9_88);
float3 l9_91=float3(l9_90.x,l9_76.y,l9_76.z);
float l9_92=l9_91.x;
float l9_93=abs((6.0*l9_92)-3.0)-1.0;
float l9_94=2.0-abs((6.0*l9_92)-2.0);
float l9_95=2.0-abs((6.0*l9_92)-4.0);
float3 l9_96=fast::clamp(float3(l9_93,l9_94,l9_95),float3(0.0),float3(1.0));
float3 l9_97=l9_96;
float l9_98=(1.0-abs((2.0*l9_91.z)-1.0))*l9_91.y;
l9_97=((l9_97-float3(0.5))*l9_98)+float3(l9_91.z);
float3 l9_99=l9_97;
float3 l9_100=l9_99;
return l9_100;
}
else
{
if ((int(BLEND_MODE_SATURATION_tmp)!=0))
{
float3 param_2=a;
float3 param_3=b;
float3 l9_101=param_2;
float3 l9_102=l9_101;
float4 l9_103;
if (l9_102.y<l9_102.z)
{
l9_103=float4(l9_102.zy,-1.0,0.66666669);
}
else
{
l9_103=float4(l9_102.yz,0.0,-0.33333334);
}
float4 l9_104=l9_103;
float4 l9_105;
if (l9_102.x<l9_104.x)
{
l9_105=float4(l9_104.xyw,l9_102.x);
}
else
{
l9_105=float4(l9_102.x,l9_104.yzx);
}
float4 l9_106=l9_105;
float l9_107=l9_106.x-fast::min(l9_106.w,l9_106.y);
float l9_108=abs(((l9_106.w-l9_106.y)/((6.0*l9_107)+1e-07))+l9_106.z);
float l9_109=l9_106.x;
float3 l9_110=float3(l9_108,l9_107,l9_109);
float3 l9_111=l9_110;
float l9_112=l9_111.z-(l9_111.y*0.5);
float l9_113=l9_111.y/((1.0-abs((2.0*l9_112)-1.0))+1e-07);
float3 l9_114=float3(l9_111.x,l9_113,l9_112);
float3 l9_115=l9_114;
float l9_116=l9_115.x;
float3 l9_117=param_3;
float3 l9_118=l9_117;
float4 l9_119;
if (l9_118.y<l9_118.z)
{
l9_119=float4(l9_118.zy,-1.0,0.66666669);
}
else
{
l9_119=float4(l9_118.yz,0.0,-0.33333334);
}
float4 l9_120=l9_119;
float4 l9_121;
if (l9_118.x<l9_120.x)
{
l9_121=float4(l9_120.xyw,l9_118.x);
}
else
{
l9_121=float4(l9_118.x,l9_120.yzx);
}
float4 l9_122=l9_121;
float l9_123=l9_122.x-fast::min(l9_122.w,l9_122.y);
float l9_124=abs(((l9_122.w-l9_122.y)/((6.0*l9_123)+1e-07))+l9_122.z);
float l9_125=l9_122.x;
float3 l9_126=float3(l9_124,l9_123,l9_125);
float3 l9_127=l9_126;
float l9_128=l9_127.z-(l9_127.y*0.5);
float l9_129=l9_127.y/((1.0-abs((2.0*l9_128)-1.0))+1e-07);
float3 l9_130=float3(l9_127.x,l9_129,l9_128);
float3 l9_131=float3(l9_116,l9_130.y,l9_115.z);
float l9_132=l9_131.x;
float l9_133=abs((6.0*l9_132)-3.0)-1.0;
float l9_134=2.0-abs((6.0*l9_132)-2.0);
float l9_135=2.0-abs((6.0*l9_132)-4.0);
float3 l9_136=fast::clamp(float3(l9_133,l9_134,l9_135),float3(0.0),float3(1.0));
float3 l9_137=l9_136;
float l9_138=(1.0-abs((2.0*l9_131.z)-1.0))*l9_131.y;
l9_137=((l9_137-float3(0.5))*l9_138)+float3(l9_131.z);
float3 l9_139=l9_137;
float3 l9_140=l9_139;
return l9_140;
}
else
{
if ((int(BLEND_MODE_COLOR_tmp)!=0))
{
float3 param_4=a;
float3 param_5=b;
float3 l9_141=param_5;
float3 l9_142=l9_141;
float4 l9_143;
if (l9_142.y<l9_142.z)
{
l9_143=float4(l9_142.zy,-1.0,0.66666669);
}
else
{
l9_143=float4(l9_142.yz,0.0,-0.33333334);
}
float4 l9_144=l9_143;
float4 l9_145;
if (l9_142.x<l9_144.x)
{
l9_145=float4(l9_144.xyw,l9_142.x);
}
else
{
l9_145=float4(l9_142.x,l9_144.yzx);
}
float4 l9_146=l9_145;
float l9_147=l9_146.x-fast::min(l9_146.w,l9_146.y);
float l9_148=abs(((l9_146.w-l9_146.y)/((6.0*l9_147)+1e-07))+l9_146.z);
float l9_149=l9_146.x;
float3 l9_150=float3(l9_148,l9_147,l9_149);
float3 l9_151=l9_150;
float l9_152=l9_151.z-(l9_151.y*0.5);
float l9_153=l9_151.y/((1.0-abs((2.0*l9_152)-1.0))+1e-07);
float3 l9_154=float3(l9_151.x,l9_153,l9_152);
float3 l9_155=l9_154;
float l9_156=l9_155.x;
float l9_157=l9_155.y;
float3 l9_158=param_4;
float3 l9_159=l9_158;
float4 l9_160;
if (l9_159.y<l9_159.z)
{
l9_160=float4(l9_159.zy,-1.0,0.66666669);
}
else
{
l9_160=float4(l9_159.yz,0.0,-0.33333334);
}
float4 l9_161=l9_160;
float4 l9_162;
if (l9_159.x<l9_161.x)
{
l9_162=float4(l9_161.xyw,l9_159.x);
}
else
{
l9_162=float4(l9_159.x,l9_161.yzx);
}
float4 l9_163=l9_162;
float l9_164=l9_163.x-fast::min(l9_163.w,l9_163.y);
float l9_165=abs(((l9_163.w-l9_163.y)/((6.0*l9_164)+1e-07))+l9_163.z);
float l9_166=l9_163.x;
float3 l9_167=float3(l9_165,l9_164,l9_166);
float3 l9_168=l9_167;
float l9_169=l9_168.z-(l9_168.y*0.5);
float l9_170=l9_168.y/((1.0-abs((2.0*l9_169)-1.0))+1e-07);
float3 l9_171=float3(l9_168.x,l9_170,l9_169);
float3 l9_172=float3(l9_156,l9_157,l9_171.z);
float l9_173=l9_172.x;
float l9_174=abs((6.0*l9_173)-3.0)-1.0;
float l9_175=2.0-abs((6.0*l9_173)-2.0);
float l9_176=2.0-abs((6.0*l9_173)-4.0);
float3 l9_177=fast::clamp(float3(l9_174,l9_175,l9_176),float3(0.0),float3(1.0));
float3 l9_178=l9_177;
float l9_179=(1.0-abs((2.0*l9_172.z)-1.0))*l9_172.y;
l9_178=((l9_178-float3(0.5))*l9_179)+float3(l9_172.z);
float3 l9_180=l9_178;
float3 l9_181=l9_180;
return l9_181;
}
else
{
if ((int(BLEND_MODE_LUMINOSITY_tmp)!=0))
{
float3 param_6=a;
float3 param_7=b;
float3 l9_182=param_6;
float3 l9_183=l9_182;
float4 l9_184;
if (l9_183.y<l9_183.z)
{
l9_184=float4(l9_183.zy,-1.0,0.66666669);
}
else
{
l9_184=float4(l9_183.yz,0.0,-0.33333334);
}
float4 l9_185=l9_184;
float4 l9_186;
if (l9_183.x<l9_185.x)
{
l9_186=float4(l9_185.xyw,l9_183.x);
}
else
{
l9_186=float4(l9_183.x,l9_185.yzx);
}
float4 l9_187=l9_186;
float l9_188=l9_187.x-fast::min(l9_187.w,l9_187.y);
float l9_189=abs(((l9_187.w-l9_187.y)/((6.0*l9_188)+1e-07))+l9_187.z);
float l9_190=l9_187.x;
float3 l9_191=float3(l9_189,l9_188,l9_190);
float3 l9_192=l9_191;
float l9_193=l9_192.z-(l9_192.y*0.5);
float l9_194=l9_192.y/((1.0-abs((2.0*l9_193)-1.0))+1e-07);
float3 l9_195=float3(l9_192.x,l9_194,l9_193);
float3 l9_196=l9_195;
float l9_197=l9_196.x;
float l9_198=l9_196.y;
float3 l9_199=param_7;
float3 l9_200=l9_199;
float4 l9_201;
if (l9_200.y<l9_200.z)
{
l9_201=float4(l9_200.zy,-1.0,0.66666669);
}
else
{
l9_201=float4(l9_200.yz,0.0,-0.33333334);
}
float4 l9_202=l9_201;
float4 l9_203;
if (l9_200.x<l9_202.x)
{
l9_203=float4(l9_202.xyw,l9_200.x);
}
else
{
l9_203=float4(l9_200.x,l9_202.yzx);
}
float4 l9_204=l9_203;
float l9_205=l9_204.x-fast::min(l9_204.w,l9_204.y);
float l9_206=abs(((l9_204.w-l9_204.y)/((6.0*l9_205)+1e-07))+l9_204.z);
float l9_207=l9_204.x;
float3 l9_208=float3(l9_206,l9_205,l9_207);
float3 l9_209=l9_208;
float l9_210=l9_209.z-(l9_209.y*0.5);
float l9_211=l9_209.y/((1.0-abs((2.0*l9_210)-1.0))+1e-07);
float3 l9_212=float3(l9_209.x,l9_211,l9_210);
float3 l9_213=float3(l9_197,l9_198,l9_212.z);
float l9_214=l9_213.x;
float l9_215=abs((6.0*l9_214)-3.0)-1.0;
float l9_216=2.0-abs((6.0*l9_214)-2.0);
float l9_217=2.0-abs((6.0*l9_214)-4.0);
float3 l9_218=fast::clamp(float3(l9_215,l9_216,l9_217),float3(0.0),float3(1.0));
float3 l9_219=l9_218;
float l9_220=(1.0-abs((2.0*l9_213.z)-1.0))*l9_213.y;
l9_219=((l9_219-float3(0.5))*l9_220)+float3(l9_213.z);
float3 l9_221=l9_219;
float3 l9_222=l9_221;
return l9_222;
}
else
{
float3 param_8=a;
float3 param_9=b;
float3 l9_223=param_8;
float l9_224=((0.29899999*l9_223.x)+(0.58700001*l9_223.y))+(0.114*l9_223.z);
float l9_225=l9_224;
float l9_226=1.0;
float l9_227=pow(l9_225,1.0/UserUniforms.correctedIntensity);
int l9_228;
if ((int(intensityTextureHasSwappedViews_tmp)!=0))
{
int l9_229=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_229=0;
}
else
{
l9_229=varStereoViewID;
}
int l9_230=l9_229;
l9_228=1-l9_230;
}
else
{
int l9_231=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_231=0;
}
else
{
l9_231=varStereoViewID;
}
int l9_232=l9_231;
l9_228=l9_232;
}
int l9_233=l9_228;
int l9_234=intensityTextureLayout_tmp;
int l9_235=l9_233;
float2 l9_236=float2(l9_227,0.5);
bool l9_237=(int(SC_USE_UV_TRANSFORM_intensityTexture_tmp)!=0);
float3x3 l9_238=UserUniforms.intensityTextureTransform;
int2 l9_239=int2(SC_SOFTWARE_WRAP_MODE_U_intensityTexture_tmp,SC_SOFTWARE_WRAP_MODE_V_intensityTexture_tmp);
bool l9_240=(int(SC_USE_UV_MIN_MAX_intensityTexture_tmp)!=0);
float4 l9_241=UserUniforms.intensityTextureUvMinMax;
bool l9_242=(int(SC_USE_CLAMP_TO_BORDER_intensityTexture_tmp)!=0);
float4 l9_243=UserUniforms.intensityTextureBorderColor;
float l9_244=0.0;
bool l9_245=l9_242&&(!l9_240);
float l9_246=1.0;
float l9_247=l9_236.x;
int l9_248=l9_239.x;
if (l9_248==1)
{
l9_247=fract(l9_247);
}
else
{
if (l9_248==2)
{
float l9_249=fract(l9_247);
float l9_250=l9_247-l9_249;
float l9_251=step(0.25,fract(l9_250*0.5));
l9_247=mix(l9_249,1.0-l9_249,fast::clamp(l9_251,0.0,1.0));
}
}
l9_236.x=l9_247;
float l9_252=l9_236.y;
int l9_253=l9_239.y;
if (l9_253==1)
{
l9_252=fract(l9_252);
}
else
{
if (l9_253==2)
{
float l9_254=fract(l9_252);
float l9_255=l9_252-l9_254;
float l9_256=step(0.25,fract(l9_255*0.5));
l9_252=mix(l9_254,1.0-l9_254,fast::clamp(l9_256,0.0,1.0));
}
}
l9_236.y=l9_252;
if (l9_240)
{
bool l9_257=l9_242;
bool l9_258;
if (l9_257)
{
l9_258=l9_239.x==3;
}
else
{
l9_258=l9_257;
}
float l9_259=l9_236.x;
float l9_260=l9_241.x;
float l9_261=l9_241.z;
bool l9_262=l9_258;
float l9_263=l9_246;
float l9_264=fast::clamp(l9_259,l9_260,l9_261);
float l9_265=step(abs(l9_259-l9_264),9.9999997e-06);
l9_263*=(l9_265+((1.0-float(l9_262))*(1.0-l9_265)));
l9_259=l9_264;
l9_236.x=l9_259;
l9_246=l9_263;
bool l9_266=l9_242;
bool l9_267;
if (l9_266)
{
l9_267=l9_239.y==3;
}
else
{
l9_267=l9_266;
}
float l9_268=l9_236.y;
float l9_269=l9_241.y;
float l9_270=l9_241.w;
bool l9_271=l9_267;
float l9_272=l9_246;
float l9_273=fast::clamp(l9_268,l9_269,l9_270);
float l9_274=step(abs(l9_268-l9_273),9.9999997e-06);
l9_272*=(l9_274+((1.0-float(l9_271))*(1.0-l9_274)));
l9_268=l9_273;
l9_236.y=l9_268;
l9_246=l9_272;
}
float2 l9_275=l9_236;
bool l9_276=l9_237;
float3x3 l9_277=l9_238;
if (l9_276)
{
l9_275=float2((l9_277*float3(l9_275,1.0)).xy);
}
float2 l9_278=l9_275;
l9_236=l9_278;
float l9_279=l9_236.x;
int l9_280=l9_239.x;
bool l9_281=l9_245;
float l9_282=l9_246;
if ((l9_280==0)||(l9_280==3))
{
float l9_283=l9_279;
float l9_284=0.0;
float l9_285=1.0;
bool l9_286=l9_281;
float l9_287=l9_282;
float l9_288=fast::clamp(l9_283,l9_284,l9_285);
float l9_289=step(abs(l9_283-l9_288),9.9999997e-06);
l9_287*=(l9_289+((1.0-float(l9_286))*(1.0-l9_289)));
l9_283=l9_288;
l9_279=l9_283;
l9_282=l9_287;
}
l9_236.x=l9_279;
l9_246=l9_282;
float l9_290=l9_236.y;
int l9_291=l9_239.y;
bool l9_292=l9_245;
float l9_293=l9_246;
if ((l9_291==0)||(l9_291==3))
{
float l9_294=l9_290;
float l9_295=0.0;
float l9_296=1.0;
bool l9_297=l9_292;
float l9_298=l9_293;
float l9_299=fast::clamp(l9_294,l9_295,l9_296);
float l9_300=step(abs(l9_294-l9_299),9.9999997e-06);
l9_298*=(l9_300+((1.0-float(l9_297))*(1.0-l9_300)));
l9_294=l9_299;
l9_290=l9_294;
l9_293=l9_298;
}
l9_236.y=l9_290;
l9_246=l9_293;
float2 l9_301=l9_236;
int l9_302=l9_234;
int l9_303=l9_235;
float l9_304=l9_244;
float2 l9_305=l9_301;
int l9_306=l9_302;
int l9_307=l9_303;
float3 l9_308=float3(0.0);
if (l9_306==0)
{
l9_308=float3(l9_305,0.0);
}
else
{
if (l9_306==1)
{
l9_308=float3(l9_305.x,(l9_305.y*0.5)+(0.5-(float(l9_307)*0.5)),0.0);
}
else
{
l9_308=float3(l9_305,float(l9_307));
}
}
float3 l9_309=l9_308;
float3 l9_310=l9_309;
float4 l9_311=intensityTexture.sample(intensityTextureSmpSC,l9_310.xy,bias(l9_304));
float4 l9_312=l9_311;
if (l9_242)
{
l9_312=mix(l9_243,l9_312,float4(l9_246));
}
float4 l9_313=l9_312;
float3 l9_314=l9_313.xyz;
float3 l9_315=l9_314;
float l9_316=16.0;
float l9_317=((((l9_315.x*256.0)+l9_315.y)+(l9_315.z/256.0))/257.00391)*l9_316;
float l9_318=l9_317;
if ((int(BLEND_MODE_FORGRAY_tmp)!=0))
{
l9_318=fast::max(l9_318,1.0);
}
if ((int(BLEND_MODE_NOTBRIGHT_tmp)!=0))
{
l9_318=fast::min(l9_318,1.0);
}
float l9_319=l9_225;
float3 l9_320=param_8;
float3 l9_321=param_9;
float l9_322=l9_226;
float l9_323=l9_318;
float3 l9_324=transformColor(l9_319,l9_320,l9_321,l9_322,l9_323);
return l9_324;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
float4 sc_OutputMotionVectorIfNeeded(thread const float4& finalColor,thread float4& varPosAndMotion,thread float4& varNormalAndMotion)
{
if ((int(sc_MotionVectorsPass_tmp)!=0))
{
float2 param=float2(varPosAndMotion.w,varNormalAndMotion.w);
float l9_0=(param.x*5.0)+0.5;
float l9_1=floor(l9_0*65535.0);
float l9_2=floor(l9_1*0.00390625);
float2 l9_3=float2(l9_2/255.0,(l9_1-(l9_2*256.0))/255.0);
float l9_4=(param.y*5.0)+0.5;
float l9_5=floor(l9_4*65535.0);
float l9_6=floor(l9_5*0.00390625);
float2 l9_7=float2(l9_6/255.0,(l9_5-(l9_6*256.0))/255.0);
float4 l9_8=float4(l9_3,l9_7);
return l9_8;
}
else
{
return finalColor;
}
}
fragment main_frag_out main_frag(main_frag_in in [[stage_in]],constant sc_Set0& sc_set0 [[buffer(0)]],float4 gl_FragCoord [[position]])
{
main_frag_out out={};
bool N81_borderOnly=false;
float2 N81_uv=float2(0.0);
float2 N81_size=float2(0.0);
float N81_cursorLength=0.0;
float N81_isHovered=0.0;
float N81_isCenter=0.0;
float N81_isZone=0.0;
float N81_dotsStop1=0.0;
float N81_dotsStop2=0.0;
float N81_circleScalar=0.0;
float N81_circle=0.0;
bool N114_borderOnly=false;
bool N114_cutOutCenter=false;
float2 N114_uv=float2(0.0);
float2 N114_size=float2(0.0);
float N114_margin=0.0;
float N114_isCenter=0.0;
float N102_grabZonesCount=0.0;
float2 N102_uv=float2(0.0);
float2 N102_size=float2(0.0);
float N102_isZone=0.0;
int N7_useBorder=0;
float N7_radius=0.0;
float N7_borderSize=0.0;
float N7_borderSoftness=0.0;
float2 N7_position=float2(0.0);
float2 N7_scale=float2(0.0);
float N7_dist=0.0;
if ((int(sc_DepthOnly_tmp)!=0))
{
return out;
}
if ((sc_StereoRenderingMode_tmp==1)&&(sc_StereoRendering_IsClipDistanceEnabled_tmp==0))
{
if (in.varClipDistance<0.0)
{
discard_fragment();
}
}
ssPreviewInfo PreviewInfo;
PreviewInfo.Color=in.PreviewVertexColor;
PreviewInfo.Saved=((in.PreviewVertexSaved*1.0)!=0.0) ? true : false;
float4 FinalColor=float4(1.0);
ssGlobals Globals;
Globals.gTimeElapsed=(*sc_set0.UserUniforms).sc_Time.x;
Globals.gTimeDelta=(*sc_set0.UserUniforms).sc_Time.y;
Globals.SurfacePosition_ObjectSpace=((*sc_set0.UserUniforms).sc_ModelMatrixInverse*float4(in.varPosAndMotion.xyz,1.0)).xyz;
float3 Position_N13=float3(0.0);
Position_N13=Globals.SurfacePosition_ObjectSpace;
float2 Output_N36=float2(0.0);
float2 param=(*sc_set0.UserUniforms).size;
Output_N36=param;
float2 Value_N23=float2(0.0);
Value_N23=Output_N36;
float Value1_N37=0.0;
float Value2_N37=0.0;
float2 param_1=Value_N23;
float param_2=param_1.x;
float param_3=param_1.y;
Value1_N37=param_2;
Value2_N37=param_3;
float2 Value_N14=float2(0.0);
Value_N14.x=Value1_N37;
Value_N14.y=Value2_N37;
float Output_N33=0.0;
float param_4=(*sc_set0.UserUniforms).cornerRadius;
Output_N33=param_4;
float Value_N24=0.0;
Value_N24=Output_N33;
float Output_N35=0.0;
Output_N35=Value_N24-1.0;
float Output_N32=0.0;
Output_N32=Output_N35*(*sc_set0.UserUniforms).Port_Input1_N032;
float2 Output_N34=float2(0.0);
Output_N34=Value_N14-float2(Output_N32);
float2 Output_N25=float2(0.0);
Output_N25=Output_N34*(*sc_set0.UserUniforms).Port_Input1_N025;
float2 Output_N31=float2(0.0);
Output_N31=Position_N13.xy+Output_N25;
float Value1_N15=0.0;
float Value2_N15=0.0;
float2 param_5=Output_N34;
float param_6=param_5.x;
float param_7=param_5.y;
Value1_N15=param_6;
Value2_N15=param_7;
float Output_N16=0.0;
Output_N16=(*sc_set0.UserUniforms).Port_Input0_N016*Value1_N15;
float Output_N17=0.0;
Output_N17=(*sc_set0.UserUniforms).Port_Input0_N017*Value2_N15;
float2 Value_N19=float2(0.0);
Value_N19.x=Output_N16;
Value_N19.y=Output_N17;
float2 Output_N18=float2(0.0);
Output_N18=Output_N31+Value_N19;
float2 Output_N26=float2(0.0);
Output_N26=Output_N25+float2(Value_N24);
float2 Output_N22=float2(0.0);
Output_N22=Output_N18/(Output_N26+float2(1.234e-06));
float2 Export_N38=float2(0.0);
Export_N38=Output_N22;
float2 Output_N45=float2(0.0);
Output_N45=Export_N38*float2((*sc_set0.UserUniforms).Port_Input1_N045);
float2 Output_N40=float2(0.0);
Output_N40=Output_N45+(*sc_set0.UserUniforms).Port_Input1_N040;
float4 Color_N127=float4(0.0);
int l9_0;
if ((int(backgroundHasSwappedViews_tmp)!=0))
{
int l9_1=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_1=0;
}
else
{
l9_1=in.varStereoViewID;
}
int l9_2=l9_1;
l9_0=1-l9_2;
}
else
{
int l9_3=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_3=0;
}
else
{
l9_3=in.varStereoViewID;
}
int l9_4=l9_3;
l9_0=l9_4;
}
int l9_5=l9_0;
int param_8=backgroundLayout_tmp;
int param_9=l9_5;
float2 param_10=Output_N40;
bool param_11=(int(SC_USE_UV_TRANSFORM_background_tmp)!=0);
float3x3 param_12=(*sc_set0.UserUniforms).backgroundTransform;
int2 param_13=int2(SC_SOFTWARE_WRAP_MODE_U_background_tmp,SC_SOFTWARE_WRAP_MODE_V_background_tmp);
bool param_14=(int(SC_USE_UV_MIN_MAX_background_tmp)!=0);
float4 param_15=(*sc_set0.UserUniforms).backgroundUvMinMax;
bool param_16=(int(SC_USE_CLAMP_TO_BORDER_background_tmp)!=0);
float4 param_17=(*sc_set0.UserUniforms).backgroundBorderColor;
float param_18=0.0;
bool l9_6=param_16&&(!param_14);
float l9_7=1.0;
float l9_8=param_10.x;
int l9_9=param_13.x;
if (l9_9==1)
{
l9_8=fract(l9_8);
}
else
{
if (l9_9==2)
{
float l9_10=fract(l9_8);
float l9_11=l9_8-l9_10;
float l9_12=step(0.25,fract(l9_11*0.5));
l9_8=mix(l9_10,1.0-l9_10,fast::clamp(l9_12,0.0,1.0));
}
}
param_10.x=l9_8;
float l9_13=param_10.y;
int l9_14=param_13.y;
if (l9_14==1)
{
l9_13=fract(l9_13);
}
else
{
if (l9_14==2)
{
float l9_15=fract(l9_13);
float l9_16=l9_13-l9_15;
float l9_17=step(0.25,fract(l9_16*0.5));
l9_13=mix(l9_15,1.0-l9_15,fast::clamp(l9_17,0.0,1.0));
}
}
param_10.y=l9_13;
if (param_14)
{
bool l9_18=param_16;
bool l9_19;
if (l9_18)
{
l9_19=param_13.x==3;
}
else
{
l9_19=l9_18;
}
float l9_20=param_10.x;
float l9_21=param_15.x;
float l9_22=param_15.z;
bool l9_23=l9_19;
float l9_24=l9_7;
float l9_25=fast::clamp(l9_20,l9_21,l9_22);
float l9_26=step(abs(l9_20-l9_25),9.9999997e-06);
l9_24*=(l9_26+((1.0-float(l9_23))*(1.0-l9_26)));
l9_20=l9_25;
param_10.x=l9_20;
l9_7=l9_24;
bool l9_27=param_16;
bool l9_28;
if (l9_27)
{
l9_28=param_13.y==3;
}
else
{
l9_28=l9_27;
}
float l9_29=param_10.y;
float l9_30=param_15.y;
float l9_31=param_15.w;
bool l9_32=l9_28;
float l9_33=l9_7;
float l9_34=fast::clamp(l9_29,l9_30,l9_31);
float l9_35=step(abs(l9_29-l9_34),9.9999997e-06);
l9_33*=(l9_35+((1.0-float(l9_32))*(1.0-l9_35)));
l9_29=l9_34;
param_10.y=l9_29;
l9_7=l9_33;
}
float2 l9_36=param_10;
bool l9_37=param_11;
float3x3 l9_38=param_12;
if (l9_37)
{
l9_36=float2((l9_38*float3(l9_36,1.0)).xy);
}
float2 l9_39=l9_36;
param_10=l9_39;
float l9_40=param_10.x;
int l9_41=param_13.x;
bool l9_42=l9_6;
float l9_43=l9_7;
if ((l9_41==0)||(l9_41==3))
{
float l9_44=l9_40;
float l9_45=0.0;
float l9_46=1.0;
bool l9_47=l9_42;
float l9_48=l9_43;
float l9_49=fast::clamp(l9_44,l9_45,l9_46);
float l9_50=step(abs(l9_44-l9_49),9.9999997e-06);
l9_48*=(l9_50+((1.0-float(l9_47))*(1.0-l9_50)));
l9_44=l9_49;
l9_40=l9_44;
l9_43=l9_48;
}
param_10.x=l9_40;
l9_7=l9_43;
float l9_51=param_10.y;
int l9_52=param_13.y;
bool l9_53=l9_6;
float l9_54=l9_7;
if ((l9_52==0)||(l9_52==3))
{
float l9_55=l9_51;
float l9_56=0.0;
float l9_57=1.0;
bool l9_58=l9_53;
float l9_59=l9_54;
float l9_60=fast::clamp(l9_55,l9_56,l9_57);
float l9_61=step(abs(l9_55-l9_60),9.9999997e-06);
l9_59*=(l9_61+((1.0-float(l9_58))*(1.0-l9_61)));
l9_55=l9_60;
l9_51=l9_55;
l9_54=l9_59;
}
param_10.y=l9_51;
l9_7=l9_54;
float2 l9_62=param_10;
int l9_63=param_8;
int l9_64=param_9;
float l9_65=param_18;
float2 l9_66=l9_62;
int l9_67=l9_63;
int l9_68=l9_64;
float3 l9_69=float3(0.0);
if (l9_67==0)
{
l9_69=float3(l9_66,0.0);
}
else
{
if (l9_67==1)
{
l9_69=float3(l9_66.x,(l9_66.y*0.5)+(0.5-(float(l9_68)*0.5)),0.0);
}
else
{
l9_69=float3(l9_66,float(l9_68));
}
}
float3 l9_70=l9_69;
float3 l9_71=l9_70;
float4 l9_72=sc_set0.background.sample(sc_set0.backgroundSmpSC,l9_71.xy,bias(l9_65));
float4 l9_73=l9_72;
if (param_16)
{
l9_73=mix(param_17,l9_73,float4(l9_7));
}
float4 l9_74=l9_73;
Color_N127=l9_74;
float4 Output_N123=float4(0.0);
float4 param_19=(*sc_set0.UserUniforms).highlightColorStop2;
Output_N123=param_19;
float4 Output_N124=float4(0.0);
float4 param_20=(*sc_set0.UserUniforms).highlightColorStop1;
Output_N124=param_20;
float Output_N107=0.0;
float param_21=(*sc_set0.UserUniforms).highlightStop1;
Output_N107=param_21;
float Output_N108=0.0;
float param_22=(*sc_set0.UserUniforms).highlightStop2;
Output_N108=param_22;
float2 Output_N85=float2(0.0);
float2 param_23=(*sc_set0.UserUniforms).cursorPosition;
Output_N85=param_23;
float2 Output_N87=float2(0.0);
Output_N87=Export_N38-Output_N85;
float2 Output_N94=float2(0.0);
Output_N94=Output_N87/(float2((*sc_set0.UserUniforms).Port_Input1_N094)+float2(1.234e-06));
float2 Output_N95=float2(0.0);
Output_N95=Output_N94*Output_N36;
float2 Output_N50=float2(0.0);
Output_N50=Output_N95-float2((*sc_set0.UserUniforms).Port_Input1_N050);
float2 Output_N49=float2(0.0);
Output_N49=fast::clamp(Output_N50+float2(0.001),(*sc_set0.UserUniforms).Port_Input1_N049+float2(0.001),(*sc_set0.UserUniforms).Port_Input2_N049+float2(0.001))-float2(0.001);
float4 Color_N46=float4(0.0);
int l9_75;
if ((int(circleTextureHasSwappedViews_tmp)!=0))
{
int l9_76=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_76=0;
}
else
{
l9_76=in.varStereoViewID;
}
int l9_77=l9_76;
l9_75=1-l9_77;
}
else
{
int l9_78=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_78=0;
}
else
{
l9_78=in.varStereoViewID;
}
int l9_79=l9_78;
l9_75=l9_79;
}
int l9_80=l9_75;
int param_24=circleTextureLayout_tmp;
int param_25=l9_80;
float2 param_26=Output_N49;
bool param_27=(int(SC_USE_UV_TRANSFORM_circleTexture_tmp)!=0);
float3x3 param_28=(*sc_set0.UserUniforms).circleTextureTransform;
int2 param_29=int2(SC_SOFTWARE_WRAP_MODE_U_circleTexture_tmp,SC_SOFTWARE_WRAP_MODE_V_circleTexture_tmp);
bool param_30=(int(SC_USE_UV_MIN_MAX_circleTexture_tmp)!=0);
float4 param_31=(*sc_set0.UserUniforms).circleTextureUvMinMax;
bool param_32=(int(SC_USE_CLAMP_TO_BORDER_circleTexture_tmp)!=0);
float4 param_33=(*sc_set0.UserUniforms).circleTextureBorderColor;
float param_34=0.0;
bool l9_81=param_32&&(!param_30);
float l9_82=1.0;
float l9_83=param_26.x;
int l9_84=param_29.x;
if (l9_84==1)
{
l9_83=fract(l9_83);
}
else
{
if (l9_84==2)
{
float l9_85=fract(l9_83);
float l9_86=l9_83-l9_85;
float l9_87=step(0.25,fract(l9_86*0.5));
l9_83=mix(l9_85,1.0-l9_85,fast::clamp(l9_87,0.0,1.0));
}
}
param_26.x=l9_83;
float l9_88=param_26.y;
int l9_89=param_29.y;
if (l9_89==1)
{
l9_88=fract(l9_88);
}
else
{
if (l9_89==2)
{
float l9_90=fract(l9_88);
float l9_91=l9_88-l9_90;
float l9_92=step(0.25,fract(l9_91*0.5));
l9_88=mix(l9_90,1.0-l9_90,fast::clamp(l9_92,0.0,1.0));
}
}
param_26.y=l9_88;
if (param_30)
{
bool l9_93=param_32;
bool l9_94;
if (l9_93)
{
l9_94=param_29.x==3;
}
else
{
l9_94=l9_93;
}
float l9_95=param_26.x;
float l9_96=param_31.x;
float l9_97=param_31.z;
bool l9_98=l9_94;
float l9_99=l9_82;
float l9_100=fast::clamp(l9_95,l9_96,l9_97);
float l9_101=step(abs(l9_95-l9_100),9.9999997e-06);
l9_99*=(l9_101+((1.0-float(l9_98))*(1.0-l9_101)));
l9_95=l9_100;
param_26.x=l9_95;
l9_82=l9_99;
bool l9_102=param_32;
bool l9_103;
if (l9_102)
{
l9_103=param_29.y==3;
}
else
{
l9_103=l9_102;
}
float l9_104=param_26.y;
float l9_105=param_31.y;
float l9_106=param_31.w;
bool l9_107=l9_103;
float l9_108=l9_82;
float l9_109=fast::clamp(l9_104,l9_105,l9_106);
float l9_110=step(abs(l9_104-l9_109),9.9999997e-06);
l9_108*=(l9_110+((1.0-float(l9_107))*(1.0-l9_110)));
l9_104=l9_109;
param_26.y=l9_104;
l9_82=l9_108;
}
float2 l9_111=param_26;
bool l9_112=param_27;
float3x3 l9_113=param_28;
if (l9_112)
{
l9_111=float2((l9_113*float3(l9_111,1.0)).xy);
}
float2 l9_114=l9_111;
param_26=l9_114;
float l9_115=param_26.x;
int l9_116=param_29.x;
bool l9_117=l9_81;
float l9_118=l9_82;
if ((l9_116==0)||(l9_116==3))
{
float l9_119=l9_115;
float l9_120=0.0;
float l9_121=1.0;
bool l9_122=l9_117;
float l9_123=l9_118;
float l9_124=fast::clamp(l9_119,l9_120,l9_121);
float l9_125=step(abs(l9_119-l9_124),9.9999997e-06);
l9_123*=(l9_125+((1.0-float(l9_122))*(1.0-l9_125)));
l9_119=l9_124;
l9_115=l9_119;
l9_118=l9_123;
}
param_26.x=l9_115;
l9_82=l9_118;
float l9_126=param_26.y;
int l9_127=param_29.y;
bool l9_128=l9_81;
float l9_129=l9_82;
if ((l9_127==0)||(l9_127==3))
{
float l9_130=l9_126;
float l9_131=0.0;
float l9_132=1.0;
bool l9_133=l9_128;
float l9_134=l9_129;
float l9_135=fast::clamp(l9_130,l9_131,l9_132);
float l9_136=step(abs(l9_130-l9_135),9.9999997e-06);
l9_134*=(l9_136+((1.0-float(l9_133))*(1.0-l9_136)));
l9_130=l9_135;
l9_126=l9_130;
l9_129=l9_134;
}
param_26.y=l9_126;
l9_82=l9_129;
float2 l9_137=param_26;
int l9_138=param_24;
int l9_139=param_25;
float l9_140=param_34;
float2 l9_141=l9_137;
int l9_142=l9_138;
int l9_143=l9_139;
float3 l9_144=float3(0.0);
if (l9_142==0)
{
l9_144=float3(l9_141,0.0);
}
else
{
if (l9_142==1)
{
l9_144=float3(l9_141.x,(l9_141.y*0.5)+(0.5-(float(l9_143)*0.5)),0.0);
}
else
{
l9_144=float3(l9_141,float(l9_143));
}
}
float3 l9_145=l9_144;
float3 l9_146=l9_145;
float4 l9_147=sc_set0.circleTexture.sample(sc_set0.circleTextureSmpSC,l9_146.xy,bias(l9_140));
float4 l9_148=l9_147;
if (param_32)
{
l9_148=mix(param_33,l9_148,float4(l9_82));
}
float4 l9_149=l9_148;
Color_N46=l9_149;
float Value4_N47=0.0;
float4 param_35=Color_N46;
float param_36=param_35.w;
Value4_N47=param_36;
float Output_N48=0.0;
Output_N48=smoothstep((*sc_set0.UserUniforms).Port_Input0_N048,(*sc_set0.UserUniforms).Port_Input1_N048,Value4_N47);
float Output_N93=0.0;
Output_N93=smoothstep(Output_N107,Output_N108,Output_N48);
float Output_N122=0.0;
float l9_150;
if (Output_N93<=0.0)
{
l9_150=0.0;
}
else
{
l9_150=pow(Output_N93,(*sc_set0.UserUniforms).Port_Input1_N122);
}
Output_N122=l9_150;
float4 Output_N125=float4(0.0);
Output_N125=mix(Output_N123,Output_N124,float4(Output_N122));
float4 Output_N121=float4(0.0);
float4 param_37=(*sc_set0.UserUniforms).highlightActiveColorStop2;
Output_N121=param_37;
float4 Output_N96=float4(0.0);
float4 param_38=(*sc_set0.UserUniforms).highlightActiveColorStop1;
Output_N96=param_38;
float4 Output_N120=float4(0.0);
Output_N120=mix(Output_N121,Output_N96,float4(Output_N122));
float Output_N103=0.0;
float param_39=(*sc_set0.UserUniforms).isActive;
Output_N103=param_39;
float4 Output_N84=float4(0.0);
Output_N84=mix(Output_N125,Output_N120,float4(Output_N103));
float Output_N98=0.0;
float param_40=(*sc_set0.UserUniforms).isHovered;
Output_N98=param_40;
float Output_N100=0.0;
Output_N100=Output_N93*Output_N98;
float4 Output_N91=float4(0.0);
Output_N91=mix(Color_N127,Output_N84,float4(Output_N100));
float Output_N113=0.0;
float param_41=float((*sc_set0.UserUniforms).borderOnly!=0);
Output_N113=param_41;
float Output_N116=0.0;
float param_42=float((*sc_set0.UserUniforms).cutOutCenter!=0);
Output_N116=param_42;
float Output_N115=0.0;
float param_43=(*sc_set0.UserUniforms).frameBorder;
Output_N115=param_43;
float isCenter_N114=0.0;
float param_44=Output_N113;
float param_45=Output_N116;
float2 param_46=Export_N38;
float2 param_47=Output_N36;
float param_48=Output_N115;
float param_49=0.0;
N114_borderOnly=param_44!=0.0;
N114_cutOutCenter=param_45!=0.0;
N114_uv=param_46;
N114_size=param_47;
N114_margin=param_48;
N114_isCenter=1.0;
if (N114_cutOutCenter||N114_borderOnly)
{
float2 l9_151=(N114_size+float2(2.0))-float2(N114_margin*2.0);
float2 l9_152=(N114_uv*(N114_size+float2(2.0)))*0.5;
float2 l9_153=l9_152;
float2 l9_154=l9_151;
float l9_155=smoothstep((l9_154.x*(-0.5))-1.0,(l9_154.x*(-0.5))+1.0,l9_153.x);
l9_155*=smoothstep((l9_154.x*0.5)+1.0,(l9_154.x*0.5)-1.0,l9_153.x);
l9_155*=smoothstep((l9_154.y*(-0.5))-1.0,(l9_154.y*(-0.5))+1.0,l9_153.y);
l9_155*=smoothstep((l9_154.y*0.5)+1.0,(l9_154.y*0.5)-1.0,l9_153.y);
float l9_156=smoothstep(0.0,1.0,l9_155);
N114_isCenter=l9_156;
}
param_49=N114_isCenter;
isCenter_N114=param_49;
float Output_N104=0.0;
float param_50=(*sc_set0.UserUniforms).grabZonesCount;
Output_N104=param_50;
float isZone_N102=0.0;
float param_51=Output_N104;
float2 param_52=Export_N38;
float2 param_53=Output_N36;
float param_54=0.0;
N102_grabZonesCount=param_51;
N102_uv=param_52;
N102_size=param_53;
N102_isZone=0.0;
if (N102_grabZonesCount>0.0)
{
float2 l9_157=(N102_uv*(N102_size+float2(2.0)))*0.5;
int l9_158=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_158<int(N102_grabZonesCount))
{
int l9_159=l9_158;
float4 l9_160=float4(0.0);
l9_160=(*sc_set0.UserUniforms).grabZones[clamp(l9_159,0,7)];
float4 l9_161=l9_160;
float4 l9_162=l9_161;
float l9_163=smoothstep(l9_162.x-3.0,l9_162.x+3.0,l9_157.x);
l9_163*=smoothstep(l9_162.y-3.0,l9_162.y+3.0,l9_157.y);
l9_163*=smoothstep(l9_162.z+3.0,l9_162.z-3.0,l9_157.x);
l9_163*=smoothstep(l9_162.w+3.0,l9_162.w-3.0,l9_157.y);
N102_isZone+=smoothstep(0.0,1.0,l9_163);
l9_158++;
continue;
}
else
{
break;
}
}
}
param_54=N102_isZone;
isZone_N102=param_54;
float Output_N111=0.0;
float param_55=(*sc_set0.UserUniforms).dotsHighlightStop1;
Output_N111=param_55;
float Output_N112=0.0;
float param_56=(*sc_set0.UserUniforms).dotsHighlightStop2;
Output_N112=param_56;
float Output_N126=0.0;
float param_57=(*sc_set0.UserUniforms).dotsScalar;
Output_N126=param_57;
float circle_N81=0.0;
float2 param_58=Export_N38;
float2 param_59=Output_N36;
float param_60=Output_N48;
float param_61=Output_N98;
float param_62=isCenter_N114;
float param_63=isZone_N102;
float param_64=Output_N111;
float param_65=Output_N112;
float param_66=Output_N113;
float param_67=Output_N126;
float param_68=0.0;
N81_uv=param_58;
N81_size=param_59;
N81_cursorLength=param_60;
N81_isHovered=param_61;
N81_isCenter=param_62;
N81_isZone=param_63;
N81_dotsStop1=param_64;
N81_dotsStop2=param_65;
N81_borderOnly=param_66!=0.0;
N81_circleScalar=param_67;
N81_circle=0.0;
float l9_164=1.0;
if ((N81_isHovered!=0.0)||(N81_isZone!=0.0))
{
if (N81_borderOnly)
{
l9_164-=N81_isCenter;
}
float2 l9_165=N81_uv*float2(N81_circleScalar*N81_size.x,N81_circleScalar*N81_size.y);
float l9_166=0.0;
if (mod(l9_165.x,2.0)<1.0)
{
if (mod(l9_165.y+1.0,2.0)<1.0)
{
float l9_167=smoothstep(N81_dotsStop1,N81_dotsStop2,N81_cursorLength);
l9_167*=N81_isHovered;
l9_167+=N81_isZone;
float2 l9_168=l9_165;
float4 l9_169=float4(0.0);
int l9_170;
if ((int(circleTextureHasSwappedViews_tmp)!=0))
{
int l9_171=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_171=0;
}
else
{
l9_171=in.varStereoViewID;
}
int l9_172=l9_171;
l9_170=1-l9_172;
}
else
{
int l9_173=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_173=0;
}
else
{
l9_173=in.varStereoViewID;
}
int l9_174=l9_173;
l9_170=l9_174;
}
int l9_175=l9_170;
int l9_176=circleTextureLayout_tmp;
int l9_177=l9_175;
float2 l9_178=l9_168;
bool l9_179=(int(SC_USE_UV_TRANSFORM_circleTexture_tmp)!=0);
float3x3 l9_180=(*sc_set0.UserUniforms).circleTextureTransform;
int2 l9_181=int2(SC_SOFTWARE_WRAP_MODE_U_circleTexture_tmp,SC_SOFTWARE_WRAP_MODE_V_circleTexture_tmp);
bool l9_182=(int(SC_USE_UV_MIN_MAX_circleTexture_tmp)!=0);
float4 l9_183=(*sc_set0.UserUniforms).circleTextureUvMinMax;
bool l9_184=(int(SC_USE_CLAMP_TO_BORDER_circleTexture_tmp)!=0);
float4 l9_185=(*sc_set0.UserUniforms).circleTextureBorderColor;
float l9_186=0.0;
bool l9_187=l9_184&&(!l9_182);
float l9_188=1.0;
float l9_189=l9_178.x;
int l9_190=l9_181.x;
if (l9_190==1)
{
l9_189=fract(l9_189);
}
else
{
if (l9_190==2)
{
float l9_191=fract(l9_189);
float l9_192=l9_189-l9_191;
float l9_193=step(0.25,fract(l9_192*0.5));
l9_189=mix(l9_191,1.0-l9_191,fast::clamp(l9_193,0.0,1.0));
}
}
l9_178.x=l9_189;
float l9_194=l9_178.y;
int l9_195=l9_181.y;
if (l9_195==1)
{
l9_194=fract(l9_194);
}
else
{
if (l9_195==2)
{
float l9_196=fract(l9_194);
float l9_197=l9_194-l9_196;
float l9_198=step(0.25,fract(l9_197*0.5));
l9_194=mix(l9_196,1.0-l9_196,fast::clamp(l9_198,0.0,1.0));
}
}
l9_178.y=l9_194;
if (l9_182)
{
bool l9_199=l9_184;
bool l9_200;
if (l9_199)
{
l9_200=l9_181.x==3;
}
else
{
l9_200=l9_199;
}
float l9_201=l9_178.x;
float l9_202=l9_183.x;
float l9_203=l9_183.z;
bool l9_204=l9_200;
float l9_205=l9_188;
float l9_206=fast::clamp(l9_201,l9_202,l9_203);
float l9_207=step(abs(l9_201-l9_206),9.9999997e-06);
l9_205*=(l9_207+((1.0-float(l9_204))*(1.0-l9_207)));
l9_201=l9_206;
l9_178.x=l9_201;
l9_188=l9_205;
bool l9_208=l9_184;
bool l9_209;
if (l9_208)
{
l9_209=l9_181.y==3;
}
else
{
l9_209=l9_208;
}
float l9_210=l9_178.y;
float l9_211=l9_183.y;
float l9_212=l9_183.w;
bool l9_213=l9_209;
float l9_214=l9_188;
float l9_215=fast::clamp(l9_210,l9_211,l9_212);
float l9_216=step(abs(l9_210-l9_215),9.9999997e-06);
l9_214*=(l9_216+((1.0-float(l9_213))*(1.0-l9_216)));
l9_210=l9_215;
l9_178.y=l9_210;
l9_188=l9_214;
}
float2 l9_217=l9_178;
bool l9_218=l9_179;
float3x3 l9_219=l9_180;
if (l9_218)
{
l9_217=float2((l9_219*float3(l9_217,1.0)).xy);
}
float2 l9_220=l9_217;
l9_178=l9_220;
float l9_221=l9_178.x;
int l9_222=l9_181.x;
bool l9_223=l9_187;
float l9_224=l9_188;
if ((l9_222==0)||(l9_222==3))
{
float l9_225=l9_221;
float l9_226=0.0;
float l9_227=1.0;
bool l9_228=l9_223;
float l9_229=l9_224;
float l9_230=fast::clamp(l9_225,l9_226,l9_227);
float l9_231=step(abs(l9_225-l9_230),9.9999997e-06);
l9_229*=(l9_231+((1.0-float(l9_228))*(1.0-l9_231)));
l9_225=l9_230;
l9_221=l9_225;
l9_224=l9_229;
}
l9_178.x=l9_221;
l9_188=l9_224;
float l9_232=l9_178.y;
int l9_233=l9_181.y;
bool l9_234=l9_187;
float l9_235=l9_188;
if ((l9_233==0)||(l9_233==3))
{
float l9_236=l9_232;
float l9_237=0.0;
float l9_238=1.0;
bool l9_239=l9_234;
float l9_240=l9_235;
float l9_241=fast::clamp(l9_236,l9_237,l9_238);
float l9_242=step(abs(l9_236-l9_241),9.9999997e-06);
l9_240*=(l9_242+((1.0-float(l9_239))*(1.0-l9_242)));
l9_236=l9_241;
l9_232=l9_236;
l9_235=l9_240;
}
l9_178.y=l9_232;
l9_188=l9_235;
float2 l9_243=l9_178;
int l9_244=l9_176;
int l9_245=l9_177;
float l9_246=l9_186;
float2 l9_247=l9_243;
int l9_248=l9_244;
int l9_249=l9_245;
float3 l9_250=float3(0.0);
if (l9_248==0)
{
l9_250=float3(l9_247,0.0);
}
else
{
if (l9_248==1)
{
l9_250=float3(l9_247.x,(l9_247.y*0.5)+(0.5-(float(l9_249)*0.5)),0.0);
}
else
{
l9_250=float3(l9_247,float(l9_249));
}
}
float3 l9_251=l9_250;
float3 l9_252=l9_251;
float4 l9_253=sc_set0.circleTexture.sample(sc_set0.circleTextureSmpSC,l9_252.xy,bias(l9_246));
float4 l9_254=l9_253;
if (l9_184)
{
l9_254=mix(l9_185,l9_254,float4(l9_188));
}
float4 l9_255=l9_254;
l9_169=l9_255;
float4 l9_256=l9_169;
float l9_257=smoothstep(0.0,0.40000001,l9_256.w*l9_167);
float l9_258=fast::clamp(l9_257,0.0,1.0);
l9_166=l9_258;
}
}
N81_circle=l9_166*l9_164;
}
param_68=N81_circle;
circle_N81=param_68;
float4 Output_N83=float4(0.0);
Output_N83=mix(Output_N91,Output_N84,float4(circle_N81));
float4 Output_N56=float4(0.0);
float4 param_69=(*sc_set0.UserUniforms).borderColor;
Output_N56=param_69;
float Output_N71=0.0;
float param_70=(*sc_set0.UserUniforms).border;
Output_N71=param_70;
float Output_N43=0.0;
Output_N43=(*sc_set0.UserUniforms).Port_Input0_N043*Output_N33;
float Output_N42=0.0;
float param_71=(*sc_set0.UserUniforms).borderSize;
Output_N42=param_71;
float Output_N69=0.0;
Output_N69=(*sc_set0.UserUniforms).Port_Input0_N069*Output_N42;
float Output_N44=0.0;
Output_N44=Output_N43-Output_N69;
float Output_N68=0.0;
Output_N68=fast::max(Output_N44,(*sc_set0.UserUniforms).Port_Input1_N068);
float dist_N7=0.0;
float param_72=Output_N71;
float param_73=Output_N68;
float param_74=Output_N69;
float param_75=(*sc_set0.UserUniforms).Port_borderSoftness_N007;
float2 param_76=Export_N38;
float2 param_77=Output_N36;
float param_78=0.0;
N7_useBorder=int(param_72);
N7_radius=param_73;
N7_borderSize=param_74;
N7_borderSoftness=param_75;
N7_position=param_76;
N7_scale=param_77;
if (N7_useBorder==1)
{
float2 l9_259=N7_scale;
float2 l9_260=N7_position*(N7_scale+float2(2.0));
float2 l9_261=l9_260;
float2 l9_262=l9_259;
float l9_263=length(fast::max(((((abs(l9_261)-l9_262)+float2(N7_radius))+float2(N7_borderSize))-float2(2.0))+float2(N7_borderSoftness),float2(0.0)))-N7_radius;
N7_dist=l9_263;
N7_dist=smoothstep(0.0,N7_borderSoftness*2.0,N7_dist);
if (N7_borderSize==0.0)
{
N7_dist=0.0;
}
}
else
{
N7_dist=0.0;
}
param_78=N7_dist;
dist_N7=param_78;
float Output_N109=0.0;
float param_79=(*sc_set0.UserUniforms).edgeHighlightStop1;
Output_N109=param_79;
float Output_N110=0.0;
float param_80=(*sc_set0.UserUniforms).edgeHighlightStop2;
Output_N110=param_80;
float Output_N89=0.0;
Output_N89=smoothstep(Output_N109,Output_N110,Output_N48);
float Output_N99=0.0;
Output_N99=Output_N98*Output_N89;
float Output_N90=0.0;
Output_N90=fast::max(Output_N99,(*sc_set0.UserUniforms).Port_Input1_N090);
float Output_N88=0.0;
Output_N88=dist_N7*Output_N90;
float4 Output_N41=float4(0.0);
Output_N41=mix(Output_N83,Output_N56,float4(Output_N88));
float3 Value1_N75=float3(0.0);
float Value2_N75=0.0;
float4 param_81=Output_N41;
float3 param_82=param_81.xyz;
float param_83=param_81.w;
Value1_N75=param_82;
Value2_N75=param_83;
float Result_N117=0.0;
float param_84=0.0;
float param_85=0.0;
float param_86=(*sc_set0.UserUniforms).Port_Default_N117;
ssGlobals param_88=Globals;
float l9_264=0.0;
float l9_265=float((*sc_set0.UserUniforms).cutOutCenter!=0);
l9_264=l9_265;
param_84=l9_264;
float param_87;
if ((param_84*1.0)!=0.0)
{
float l9_266=0.0;
float l9_267=float((*sc_set0.UserUniforms).borderOnly!=0);
l9_266=l9_267;
float l9_268=0.0;
float l9_269=float((*sc_set0.UserUniforms).cutOutCenter!=0);
l9_268=l9_269;
float3 l9_270=float3(0.0);
l9_270=param_88.SurfacePosition_ObjectSpace;
float2 l9_271=float2(0.0);
float2 l9_272=(*sc_set0.UserUniforms).size;
l9_271=l9_272;
float2 l9_273=float2(0.0);
l9_273=l9_271;
float l9_274=0.0;
float l9_275=0.0;
float2 l9_276=l9_273;
float l9_277=l9_276.x;
float l9_278=l9_276.y;
l9_274=l9_277;
l9_275=l9_278;
float2 l9_279=float2(0.0);
l9_279.x=l9_274;
l9_279.y=l9_275;
float l9_280=0.0;
float l9_281=(*sc_set0.UserUniforms).cornerRadius;
l9_280=l9_281;
float l9_282=0.0;
l9_282=l9_280;
float l9_283=0.0;
l9_283=l9_282-1.0;
float l9_284=0.0;
l9_284=l9_283*(*sc_set0.UserUniforms).Port_Input1_N032;
float2 l9_285=float2(0.0);
l9_285=l9_279-float2(l9_284);
float2 l9_286=float2(0.0);
l9_286=l9_285*(*sc_set0.UserUniforms).Port_Input1_N025;
float2 l9_287=float2(0.0);
l9_287=l9_270.xy+l9_286;
float l9_288=0.0;
float l9_289=0.0;
float2 l9_290=l9_285;
float l9_291=l9_290.x;
float l9_292=l9_290.y;
l9_288=l9_291;
l9_289=l9_292;
float l9_293=0.0;
l9_293=(*sc_set0.UserUniforms).Port_Input0_N016*l9_288;
float l9_294=0.0;
l9_294=(*sc_set0.UserUniforms).Port_Input0_N017*l9_289;
float2 l9_295=float2(0.0);
l9_295.x=l9_293;
l9_295.y=l9_294;
float2 l9_296=float2(0.0);
l9_296=l9_287+l9_295;
float2 l9_297=float2(0.0);
l9_297=l9_286+float2(l9_282);
float2 l9_298=float2(0.0);
l9_298=l9_296/(l9_297+float2(1.234e-06));
float2 l9_299=float2(0.0);
l9_299=l9_298;
float l9_300=0.0;
float l9_301=(*sc_set0.UserUniforms).frameBorder;
l9_300=l9_301;
float l9_302=0.0;
float l9_303=l9_266;
float l9_304=l9_268;
float2 l9_305=l9_299;
float2 l9_306=l9_271;
float l9_307=l9_300;
float l9_308=0.0;
N114_borderOnly=l9_303!=0.0;
N114_cutOutCenter=l9_304!=0.0;
N114_uv=l9_305;
N114_size=l9_306;
N114_margin=l9_307;
N114_isCenter=1.0;
if (N114_cutOutCenter||N114_borderOnly)
{
float2 l9_309=(N114_size+float2(2.0))-float2(N114_margin*2.0);
float2 l9_310=(N114_uv*(N114_size+float2(2.0)))*0.5;
float2 l9_311=l9_310;
float2 l9_312=l9_309;
float l9_313=smoothstep((l9_312.x*(-0.5))-1.0,(l9_312.x*(-0.5))+1.0,l9_311.x);
l9_313*=smoothstep((l9_312.x*0.5)+1.0,(l9_312.x*0.5)-1.0,l9_311.x);
l9_313*=smoothstep((l9_312.y*(-0.5))-1.0,(l9_312.y*(-0.5))+1.0,l9_311.y);
l9_313*=smoothstep((l9_312.y*0.5)+1.0,(l9_312.y*0.5)-1.0,l9_311.y);
float l9_314=smoothstep(0.0,1.0,l9_313);
N114_isCenter=l9_314;
}
l9_308=N114_isCenter;
l9_302=l9_308;
float l9_315=0.0;
l9_315=(*sc_set0.UserUniforms).Port_Input0_N119-l9_302;
param_85=l9_315;
param_87=param_85;
}
else
{
param_87=param_86;
}
Result_N117=param_87;
float Output_N74=0.0;
float param_89=(*sc_set0.UserUniforms).opacityFactor;
Output_N74=param_89;
float Output_N78=0.0;
Output_N78=Value2_N75*Output_N74;
float Output_N118=0.0;
Output_N118=Result_N117*Output_N78;
float4 Value_N76=float4(0.0);
Value_N76=float4(Value1_N75.x,Value1_N75.y,Value1_N75.z,Value_N76.w);
Value_N76.w=Output_N118;
FinalColor=Value_N76;
float param_90=FinalColor.w;
if ((int(sc_BlendMode_AlphaTest_tmp)!=0))
{
if (param_90<(*sc_set0.UserUniforms).alphaTestThreshold)
{
discard_fragment();
}
}
if ((int(ENABLE_STIPPLE_PATTERN_TEST_tmp)!=0))
{
float4 l9_316=gl_FragCoord;
float2 l9_317=floor(mod(l9_316.xy,float2(4.0)));
float l9_318=(mod(dot(l9_317,float2(4.0,1.0))*9.0,16.0)+1.0)/17.0;
if (param_90<l9_318)
{
discard_fragment();
}
}
float4 param_91=FinalColor;
if ((int(sc_ProjectiveShadowsCaster_tmp)!=0))
{
float4 l9_319=param_91;
float4 l9_320=l9_319;
float l9_321=1.0;
if ((((int(sc_BlendMode_Normal_tmp)!=0)||(int(sc_BlendMode_AlphaToCoverage_tmp)!=0))||(int(sc_BlendMode_PremultipliedAlphaHardware_tmp)!=0))||(int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
l9_321=l9_320.w;
}
else
{
if ((int(sc_BlendMode_PremultipliedAlpha_tmp)!=0))
{
l9_321=fast::clamp(l9_320.w*2.0,0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AddWithAlphaFactor_tmp)!=0))
{
l9_321=fast::clamp(dot(l9_320.xyz,float3(l9_320.w)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AlphaTest_tmp)!=0))
{
l9_321=1.0;
}
else
{
if ((int(sc_BlendMode_Multiply_tmp)!=0))
{
l9_321=(1.0-dot(l9_320.xyz,float3(0.33333001)))*l9_320.w;
}
else
{
if ((int(sc_BlendMode_MultiplyOriginal_tmp)!=0))
{
l9_321=(1.0-fast::clamp(dot(l9_320.xyz,float3(1.0)),0.0,1.0))*l9_320.w;
}
else
{
if ((int(sc_BlendMode_ColoredGlass_tmp)!=0))
{
l9_321=fast::clamp(dot(l9_320.xyz,float3(1.0)),0.0,1.0)*l9_320.w;
}
else
{
if ((int(sc_BlendMode_Add_tmp)!=0))
{
l9_321=fast::clamp(dot(l9_320.xyz,float3(1.0)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AddWithAlphaFactor_tmp)!=0))
{
l9_321=fast::clamp(dot(l9_320.xyz,float3(1.0)),0.0,1.0)*l9_320.w;
}
else
{
if ((int(sc_BlendMode_Screen_tmp)!=0))
{
l9_321=dot(l9_320.xyz,float3(0.33333001))*l9_320.w;
}
else
{
if ((int(sc_BlendMode_Min_tmp)!=0))
{
l9_321=1.0-fast::clamp(dot(l9_320.xyz,float3(1.0)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_Max_tmp)!=0))
{
l9_321=fast::clamp(dot(l9_320.xyz,float3(1.0)),0.0,1.0);
}
}
}
}
}
}
}
}
}
}
}
}
float l9_322=l9_321;
float l9_323=l9_322;
float l9_324=(*sc_set0.UserUniforms).sc_ShadowDensity*l9_323;
float3 l9_325=mix((*sc_set0.UserUniforms).sc_ShadowColor.xyz,(*sc_set0.UserUniforms).sc_ShadowColor.xyz*l9_319.xyz,float3((*sc_set0.UserUniforms).sc_ShadowColor.w));
float4 l9_326=float4(l9_325.x,l9_325.y,l9_325.z,l9_324);
param_91=l9_326;
}
else
{
if ((int(sc_RenderAlphaToColor_tmp)!=0))
{
param_91=float4(param_91.w);
}
else
{
if ((int(sc_BlendMode_Custom_tmp)!=0))
{
float4 l9_327=param_91;
float4 l9_328=float4(0.0);
float4 l9_329=float4(0.0);
if ((int(sc_FramebufferFetch_tmp)!=0))
{
float4 l9_330=out.sc_FragData0;
l9_329=l9_330;
}
else
{
float4 l9_331=gl_FragCoord;
float2 l9_332=l9_331.xy*(*sc_set0.UserUniforms).sc_CurrentRenderTargetDims.zw;
float2 l9_333=l9_332;
float2 l9_334=float2(0.0);
if (sc_StereoRenderingMode_tmp==1)
{
int l9_335=1;
int l9_336=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_336=0;
}
else
{
l9_336=in.varStereoViewID;
}
int l9_337=l9_336;
int l9_338=l9_337;
float3 l9_339=float3(l9_333,0.0);
int l9_340=l9_335;
int l9_341=l9_338;
if (l9_340==1)
{
l9_339.y=((2.0*l9_339.y)+float(l9_341))-1.0;
}
float2 l9_342=l9_339.xy;
l9_334=l9_342;
}
else
{
l9_334=l9_333;
}
float2 l9_343=l9_334;
float2 l9_344=l9_343;
float2 l9_345=l9_344;
float2 l9_346=l9_345;
float l9_347=0.0;
int l9_348;
if ((int(sc_ScreenTextureHasSwappedViews_tmp)!=0))
{
int l9_349=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_349=0;
}
else
{
l9_349=in.varStereoViewID;
}
int l9_350=l9_349;
l9_348=1-l9_350;
}
else
{
int l9_351=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_351=0;
}
else
{
l9_351=in.varStereoViewID;
}
int l9_352=l9_351;
l9_348=l9_352;
}
int l9_353=l9_348;
float2 l9_354=l9_346;
int l9_355=sc_ScreenTextureLayout_tmp;
int l9_356=l9_353;
float l9_357=l9_347;
float2 l9_358=l9_354;
int l9_359=l9_355;
int l9_360=l9_356;
float3 l9_361=float3(0.0);
if (l9_359==0)
{
l9_361=float3(l9_358,0.0);
}
else
{
if (l9_359==1)
{
l9_361=float3(l9_358.x,(l9_358.y*0.5)+(0.5-(float(l9_360)*0.5)),0.0);
}
else
{
l9_361=float3(l9_358,float(l9_360));
}
}
float3 l9_362=l9_361;
float3 l9_363=l9_362;
float4 l9_364=sc_set0.sc_ScreenTexture.sample(sc_set0.sc_ScreenTextureSmpSC,l9_363.xy,bias(l9_357));
float4 l9_365=l9_364;
float4 l9_366=l9_365;
l9_329=l9_366;
}
float4 l9_367=l9_329;
float3 l9_368=l9_367.xyz;
float3 l9_369=l9_368;
float3 l9_370=l9_327.xyz;
float3 l9_371=definedBlend(l9_369,l9_370,in.varStereoViewID,(*sc_set0.UserUniforms),sc_set0.intensityTexture,sc_set0.intensityTextureSmpSC);
l9_328=float4(l9_371.x,l9_371.y,l9_371.z,l9_328.w);
float3 l9_372=mix(l9_368,l9_328.xyz,float3(l9_327.w));
l9_328=float4(l9_372.x,l9_372.y,l9_372.z,l9_328.w);
l9_328.w=1.0;
float4 l9_373=l9_328;
param_91=l9_373;
}
else
{
if ((int(sc_Voxelization_tmp)!=0))
{
float4 l9_374=float4(in.varScreenPos.xyz,1.0);
param_91=l9_374;
}
else
{
if ((int(sc_OutputBounds_tmp)!=0))
{
float4 l9_375=gl_FragCoord;
float l9_376=fast::clamp(abs(l9_375.z),0.0,1.0);
float4 l9_377=float4(l9_376,1.0-l9_376,1.0,1.0);
param_91=l9_377;
}
else
{
float4 l9_378=param_91;
float4 l9_379=float4(0.0);
if ((int(sc_BlendMode_MultiplyOriginal_tmp)!=0))
{
l9_379=float4(mix(float3(1.0),l9_378.xyz,float3(l9_378.w)),l9_378.w);
}
else
{
if ((int(sc_BlendMode_Screen_tmp)!=0)||(int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
float l9_380=l9_378.w;
if ((int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
l9_380=fast::clamp(l9_380,0.0,1.0);
}
l9_379=float4(l9_378.xyz*l9_380,l9_380);
}
else
{
l9_379=l9_378;
}
}
float4 l9_381=l9_379;
param_91=l9_381;
}
}
}
}
}
float4 l9_382=param_91;
FinalColor=l9_382;
if ((*sc_set0.UserUniforms).PreviewEnabled==1)
{
if (PreviewInfo.Saved)
{
FinalColor=float4(PreviewInfo.Color);
}
else
{
FinalColor=float4(0.0);
}
}
float4 l9_383=float4(0.0);
l9_383=float4(0.0);
float4 l9_384=l9_383;
float4 Cost=l9_384;
if (Cost.w>0.0)
{
FinalColor=Cost;
}
FinalColor=fast::max(FinalColor,float4(0.0));
float4 param_92=FinalColor;
FinalColor=sc_OutputMotionVectorIfNeeded(param_92,in.varPosAndMotion,in.varNormalAndMotion);
float4 param_93=FinalColor;
float4 l9_385=param_93;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_385.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
out.sc_FragData0=l9_385;
return out;
}
} // FRAGMENT SHADER

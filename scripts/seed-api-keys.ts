import { neon } from "@neondatabase/serverless";

const DATABASE_URL = "postgresql://user:password@localhost:5432/dbname";

const sql = neon(DATABASE_URL);

const RAW_KEYS = [
  {
    "id": 1,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6J-iId3gcTiyKL2ZBHHUrHgo-tZuQT7XUzxmCNnDgnH6g"
    },
    "created_at": "2026-07-20T13:04:04.325Z"
  },
  {
    "id": 2,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6LxQ4QKnl2kNCmk_MbCYyAYpmeOPDq2SrVBxGciW661KQ"
    },
    "created_at": "2026-07-22T14:18:08.898Z"
  },
  {
    "id": 4,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6JgYfn25M5k1B3tty_qkvPVJTOnjdAnjzTcmkZ52iBHxg"
    },
    "created_at": "2026-07-20T12:49:39.334Z"
  },
  {
    "id": 5,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6Lt-y29C9a5Z94r9Nanv0QJ4texN_QhCAcPFKSDGOPnbw"
    },
    "created_at": "2026-07-20T12:55:56.366Z"
  },
  {
    "id": 6,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6IcIg_VvOCMJuH-V5gv9KovWzvjFS98HjrSPHdUrKgFMw"
    },
    "created_at": "2026-07-20T12:58:33.410Z"
  },
  {
    "id": 7,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6ICecdQiZ7Vha-S5ob-TC6bWX3nevxkZGNF3_M7WNIgXA"
    },
    "created_at": "2026-07-20T12:55:37.483Z"
  },
  {
    "id": 8,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6KD3EUblxJwkJILi2fOuquP2RdX_M1tBiJliiAq8KdMHg"
    },
    "created_at": "2026-07-20T12:57:01.135Z"
  },
  {
    "id": 9,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6JyayEmC1S9Cv6BVdSf_I2fHTKsYWg80FqktMt6fDna0A"
    },
    "created_at": "2026-07-20T12:57:20.463Z"
  },
  {
    "id": 11,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6KiddT5Lq8aGfuo41to3j25oN48Oi6DxP0mdL5lsVtflg"
    },
    "created_at": "2026-07-20T12:57:57.279Z"
  },
  {
    "id": 13,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6L7zg7UX9ZhecSqyec5-0JVUmely0q5YxWCuwbfFly5EQ"
    },
    "created_at": "2026-07-22T14:15:40.866Z"
  },
  {
    "id": 14,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6Lzi_rfwcVLFipZXd7BHYvC0aBJwv9bJ_rbaUH5u14EHg"
    },
    "created_at": "2026-08-01T11:49:21.356Z"
  },
  {
    "id": 15,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6IBODaSwAiskMcs-H3nv441pSQyeYIbBQbt9WYKqhZgZw"
    },
    "created_at": "2026-07-22T14:19:22.380Z"
  },
  {
    "id": 16,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6KZ3JAfbcCJr2TV2s8RE6A13RuZ-NJxAONzUny2SuUTfg"
    },
    "created_at": "2026-07-20T13:16:56.774Z"
  },
  {
    "id": 17,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6LXXvNoHccqTALl0cdCX2wL6ekjY5LUAG0xdbo02Q67Ow"
    },
    "created_at": "2026-07-21T04:23:17.026Z"
  },
  {
    "id": 18,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6JtBGh703m0zL0PlK0IyRCdFfkm5Gz7MnguE0wDlUVdJw"
    },
    "created_at": "2026-07-21T04:52:01.589Z"
  },
  {
    "id": 19,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6LWbncxO9NPOiRRSCGMwfIn3UptC5mWJTl8LNcgCVfLYQ"
    },
    "created_at": "2026-07-21T04:57:50.291Z"
  },
  {
    "id": 21,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6IO9S5UR_-bAY_XMug7USdgIfic7BxXKHphOEMmJV5DpA"
    },
    "created_at": "2026-07-21T04:58:52.177Z"
  },
  {
    "id": 22,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6LKo_n8C0eyZl77n3ewOXXkLajfsjW1qgWcqRO_b6ZQtw"
    },
    "created_at": "2026-07-20T13:01:12.156Z"
  },
  {
    "id": 23,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6JWvJSmTHxsovgAAbIRRwIviNr76J4yX6uAiD_wToKg_A"
    },
    "created_at": "2026-07-20T13:02:13.212Z"
  },
  {
    "id": 24,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6IsMm7BheVXVI8pXdgPCgVDnNSkVg77Gzy-N4MBIB_JgQ"
    },
    "created_at": "2026-07-20T13:05:08.829Z"
  },
  {
    "id": 25,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6IhnnoIkCqvhQaia4tigrE6DkBQ2HfWgMFosqdVRtg1PQ"
    },
    "created_at": "2026-07-20T12:57:38.403Z"
  },
  {
    "id": 26,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6K4Ci0zoRIi7HDw9O7QjaW3ttLBst9nwTnnKWlZOYdFGQ"
    },
    "created_at": "2026-08-01T11:47:25.353Z"
  },
  {
    "id": 27,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6L53hN5qu5JYZ3ovPAIJbEM3SVml2qV8M-BiVmq-WLaGg"
    },
    "created_at": "2026-08-01T11:53:19.023Z"
  },
  {
    "id": 28,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6I37fjxtRxZEBiZqcYeDYSjNHDirYXZej6DetinyCdymw"
    },
    "created_at": "2026-07-22T14:17:48.630Z"
  },
  {
    "id": 29,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6JMWYMLK_TxCsiqOx2QSaLqGAzIwGMkNqrvwCG64sgLhA"
    },
    "created_at": "2026-07-20T13:17:59.968Z"
  },
  {
    "id": 30,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6J1m8jhB1WDnsmFAaF-MjCASywc_LJYxyQuqoN0RtFY1w"
    },
    "created_at": "2026-07-20T13:18:18.763Z"
  },
  {
    "id": 33,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6LAL2ghN7b9ceSs4swJ-vrVbAItZvw4tYtsRf8sFdhtaw"
    },
    "created_at": "2026-08-01T11:48:02.806Z"
  },
  {
    "id": 34,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6Is9LjJ2JH8G_b9SJI-hJxshjKjD_7h2MUspQg5CcOU3A"
    },
    "created_at": "2026-07-20T13:04:12.923Z"
  },
  {
    "id": 35,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6KdKOIIu9HdrfyaAdAIjI73gJHgo5Ra4Sx1q0nW-H-63A"
    },
    "created_at": "2026-08-01T11:54:08.978Z"
  },
  {
    "id": 36,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6LS7rJLBnoC_bXWCfPIniYAEX_xl82hMN0vqQ_oIQTuuA"
    },
    "created_at": "2026-07-20T12:56:42.380Z"
  },
  {
    "id": 37,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6LvZhWUuyy953oHETuIWWSC395ZIQVucJnlqrJaKrlIKA"
    },
    "created_at": "2026-08-01T01:27:38.026Z"
  },
  {
    "id": 38,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6JzN8T7F6Fl50_HrPqcmBHqq1AgCoQHXbEa1ZNKxH1sew"
    },
    "created_at": "2026-07-22T14:30:04.843Z"
  },
  {
    "id": 39,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6J8tQIMDOXGgEvAn6ZxofNmZfer3ND3zaJWhk4XmKd6KQ"
    },
    "created_at": "2026-07-20T13:16:44.293Z"
  },
  {
    "id": 40,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6IRXCLcd8Pd4bNU9t2QhlJdyl4oJIQFLYhp4peqAX2uJQ"
    },
    "created_at": "2026-08-08T17:53:43.725Z"
  },
  {
    "id": 41,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6IUYTiiWKycNbb3KYjhw9YGoRe_B_Z_GbdcLI4imd3Tgg"
    },
    "created_at": "2026-08-08T17:54:03.676Z"
  },
  {
    "id": 42,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6Jv5mArK6BrPoyzbwRSKfNuXTaeHhR_S7mme5M0-ccNjw"
    },
    "created_at": "2026-08-08T17:54:50.675Z"
  },
  {
    "id": 43,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6IyAY9MB5voi3iZTRgfKyDxG3c3wWkH9JMsp98pWhw7RQ"
    },
    "created_at": "2026-08-08T18:01:17.114Z"
  },
  {
    "id": 44,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6JVuzWmumYvlrA669XK0aiq712UenaIkY3FyyPTQyXtAg"
    },
    "created_at": "2026-08-08T18:02:12.138Z"
  },
  {
    "id": 45,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6Jh1-H8shx-1TeRX_6KIkRjAhNgWQdbews2fgtV8Mx1AA"
    },
    "created_at": "2026-08-08T18:10:11.838Z"
  },
  {
    "id": 46,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6L_cbkFoJZPzslLJRoY1ptAF37EXSiTTXfsq18VDYFc4Q"
    },
    "created_at": "2026-08-08T18:11:21.331Z"
  },
  {
    "id": 47,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AIzaSy_SANITIZED_KEY_PROTECTED"
    },
    "created_at": "2026-08-08T18:56:53.853Z"
  },
  {
    "id": 48,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6KXA9vdMyiCmYEGrrEKG55KImaRh69ItlrDQdllNiBlig"
    },
    "created_at": "2026-08-08T19:14:58.044Z"
  },
  {
    "id": 49,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6LQAIDqLFkhOodNbbptusgI0vFn1wiCuuepwEZBFRokpg"
    },
    "created_at": "2026-08-08T19:44:36.279Z"
  },
  {
    "id": 50,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6LPGq-vE4PDH9iFiwMv3lbFVxoig94H_g4aT3bw7gsVyA"
    },
    "created_at": "2026-07-20T15:09:34.495Z"
  },
  {
    "id": 51,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6KFc5_XCo0bR46hR74iHBZhQho74cSUo5gglV2L5s4c-g"
    },
    "created_at": "2026-07-20T15:11:28.969Z"
  },
  {
    "id": 53,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6I-_eAR8iPARb9uZF1Wg-2aH6xC0SLOVGLO_R0i8xtn5A"
    },
    "created_at": "2026-07-20T12:51:05.477Z"
  },
  {
    "id": 54,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6JdTHn52NRhNEehKI8rKbzz0ZR8PKEEWYP4Lv_oiJwbMQ"
    },
    "created_at": "2026-07-20T12:59:05.879Z"
  },
  {
    "id": 55,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6L2mGUIqrcZ5O5SoEInYg86CKe9o02gcersNuUd7BIO7Q"
    },
    "created_at": "2026-07-20T13:00:21.097Z"
  },
  {
    "id": 56,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6KjcsHocum0aXBmerIebPl_KKYoXF0KqAIzey06Bo6sLw"
    },
    "created_at": "2026-07-20T13:00:28.634Z"
  },
  {
    "id": 57,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6LDxHc-FOXlySS-qKyG4S9wAKM4WuyikTP8sfJrLIlN3Q"
    },
    "created_at": "2026-07-20T13:02:39.465Z"
  },
  {
    "id": 58,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6LsuAUnqng4_xE5iL6IGObpcVx9J2YAJPWFkQUDolv6Vw"
    },
    "created_at": "2026-07-20T13:03:32.886Z"
  },
  {
    "id": 59,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6Kb7BdEpZ56FegWq7ObQcZzSttJ-Dg3Mp-REPVFcRVHkw"
    },
    "created_at": "2026-07-21T04:59:26.905Z"
  },
  {
    "id": 60,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6JfRejqgZOYgmwSyiE_4bYB0V1pfw0kmAVIjboCfYcIdg"
    },
    "created_at": "2026-07-20T13:19:55.811Z"
  },
  {
    "id": 61,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6Kjzz2D2v5XFQ_5SX56A_t4mYFdEDkCM6as6Av6QsJcyQ"
    },
    "created_at": "2026-07-20T13:23:08.509Z"
  },
  {
    "id": 62,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6IL36VC1pcAJ8Ki8NbFnRpRNeJx9mENQTeV0NJeCD8pfg"
    },
    "created_at": "2026-07-20T13:36:45.071Z"
  },
  {
    "id": 63,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6LKbgCMzW82yFcLo5htGoGr233wahug3q_JL0AMmLihyw"
    },
    "created_at": "2026-08-01T11:52:20.705Z"
  },
  {
    "id": 64,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6J-tlhgMaanYH14arc7xy28mZr5LRLc9mYCHCUjvFzfaQ"
    },
    "created_at": "2026-07-20T12:17:58.530Z"
  },
  {
    "id": 65,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6LiLABf6fvhEr5TXCNlttFa_WOmDlCqxmCOvecAJ7MWtQ"
    },
    "created_at": "2026-07-22T14:17:07.845Z"
  },
  {
    "id": 66,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6Iaf8Cal2vPdgjtCRS2fWA6Hu89INk_Go58UkGfd3GKUA"
    },
    "created_at": "2026-07-22T14:17:28.521Z"
  },
  {
    "id": 67,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6LVJ_swlR1wt2rYx51q8HDq01rwAjGhB17NBWnD1vIKvQ"
    },
    "created_at": "2026-07-22T14:32:08.522Z"
  },
  {
    "id": 68,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6IiAzwzlWm_S__PQhq88S2BgBSfX4BcM4qF_imVfQYSbA"
    },
    "created_at": "2026-07-21T05:00:08.426Z"
  },
  {
    "id": 70,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6LDRCvXkv-QIbeM7DmkznKlU3QXEHcsobz-GJwWZ1-mhA"
    },
    "created_at": "2026-07-22T14:16:08.762Z"
  },
  {
    "id": 71,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6JIHuuD0rtjSBp2QJMMu2mu_ZTQ10zcy0lVSO_5AwwfqA"
    },
    "created_at": "2026-07-22T14:28:59.223Z"
  },
  {
    "id": 72,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6JYpUEdiBzJppKlIOlOZ9p_MJeTNocM0c34adQCQrk2oQ"
    },
    "created_at": "2026-08-08T18:06:36.697Z"
  },
  {
    "id": 73,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AIzaSy_SANITIZED_KEY_PROTECTED"
    },
    "created_at": "2026-08-08T18:13:10.720Z"
  },
  {
    "id": 74,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6K8QeO_LLElOA1WDLaKH9HBUmD0YfjTDD0fwtSCjm8SLA"
    },
    "created_at": "2026-08-08T18:14:10.748Z"
  },
  {
    "id": 75,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6LmzcDur1XvfMHCidI91eOIvItv8UKvxcf2G2MNuL0KyQ"
    },
    "created_at": "2026-08-08T18:15:10.242Z"
  },
  {
    "id": 76,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6L9xP5YC6WBloPTZPACmmdBSjrHPaqphoYgr5K71xj4ag"
    },
    "created_at": "2026-08-08T18:29:44.827Z"
  },
  {
    "id": 77,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6JfIDGkB8FWt7WB9wxt3giIj18_Gj50NpTiE_jy4F8ZCA"
    },
    "created_at": "2026-08-08T18:30:16.362Z"
  },
  {
    "id": 78,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6LWAnfsNX4CnqB69j5mYkwP670R9rPuUXFXHt_huNJ1Xw"
    },
    "created_at": "2026-08-08T18:33:53.004Z"
  },
  {
    "id": 79,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6IzUHTF35fdFDkQUIph7yNOCCZVQHbjEsE5GH-NizAEvA"
    },
    "created_at": "2026-08-08T18:46:53.272Z"
  },
  {
    "id": 80,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AIzaSy_SANITIZED_KEY_PROTECTED"
    },
    "created_at": "2026-08-08T18:51:59.274Z"
  },
  {
    "id": 81,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6L9eYBPAJ8UfDFJXJDLUEMNwafw_l6apm58feXvxvBT_w"
    },
    "created_at": "2026-08-08T18:54:47.980Z"
  },
  {
    "id": 82,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AIzaSy_SANITIZED_KEY_PROTECTED"
    },
    "created_at": "2026-08-08T18:55:23.610Z"
  },
  {
    "id": 83,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AIzaSy_SANITIZED_KEY_PROTECTED"
    },
    "created_at": "2026-08-08T18:56:13.941Z"
  },
  {
    "id": 84,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6LXOhGOgpGsHeGEbKnCWgE-GS-8xZ1ETB4Bq9rDP7yFeA"
    },
    "created_at": "2026-08-08T19:17:45.042Z"
  },
  {
    "id": 85,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AIzaSy_SANITIZED_KEY_PROTECTED"
    },
    "created_at": "2026-08-08T19:18:37.645Z"
  },
  {
    "id": 86,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6JU06FsE2foC6wNFyK4gWgvtXZm2l8OIIJtA93JvzkhUw"
    },
    "created_at": "2026-08-08T19:19:02.885Z"
  },
  {
    "id": 87,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6LvdREsmuOyXsRNW1i7RG6WfdK6xQGOiIGZ2056wG9NUg"
    },
    "created_at": "2026-08-08T19:45:11.321Z"
  },
  {
    "id": 88,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6ILo9lg6zj6sig_u5SKhJSk2uDoZKgA-svqdKTI5_0-yg"
    },
    "created_at": "2026-08-08T19:45:33.428Z"
  },
  {
    "id": 89,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6LNj_6R756HPzZUMG1CueuDapD9behuWuCjae1QTt4UTA"
    },
    "created_at": "2026-08-08T19:46:26.977Z"
  },
  {
    "id": 90,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6KWJw5WT1bKLWoQytg3VH3KT8c9Jt0PyC8gnXvAJFAnzQ"
    },
    "created_at": "2026-08-01T11:48:51.036Z"
  },
  {
    "id": 92,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6LqCWtmWP7FkDPknquFkZzSnTO5eDvjfUAqgE3BB7bZvw"
    },
    "created_at": "2026-07-20T13:22:59.803Z"
  },
  {
    "id": 93,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6LMhNY2Tzc8s4aY0MVW_otRArjEdoPHu4KG6-8tEm25kA"
    },
    "created_at": "2026-07-20T13:29:37.569Z"
  },
  {
    "id": 94,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6L10o1TmI9DV3hL5zwyFM2mvzmv3jTuw7Ut_6p-3X1HyA"
    },
    "created_at": "2026-07-20T13:05:13.610Z"
  },
  {
    "id": 95,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6Jv8NUXl64qoDxLb98aI3swR6L_RUJNe2QkTsXSCgCqNQ"
    },
    "created_at": "2026-07-20T13:06:49.872Z"
  },
  {
    "id": 98,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6Ko_ux64_RCG3BQ2MkcZ7TLaenUkovVKdJcQ4O7urYNAw"
    },
    "created_at": "2026-08-01T11:51:17.427Z"
  },
  {
    "id": 99,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6JFKOVwExD8FXAM-4cdJ29HeXmm08iz1AuVLT8nlQNQpg"
    },
    "created_at": "2026-07-20T12:14:14.477Z"
  },
  {
    "id": 100,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6LDPTXe81HSyw_mKLwJEAC1EhoGF_SLixEtj9Pu7dW4VQ"
    },
    "created_at": "2026-07-20T12:54:56.695Z"
  },
  {
    "id": 101,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6KefbEEzfiFNKURd7bquqUwDQOxgyLPUi9zoFcrTnRVJg"
    },
    "created_at": "2026-07-20T12:56:13.176Z"
  },
  {
    "id": 102,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6KUIkRwmI9RYpeMGJ-J8KRc2qAnsjZjjmlYNZ8vCzUHDw"
    },
    "created_at": "2026-08-01T11:55:00.597Z"
  },
  {
    "id": 103,
    "provider_name": "gemini",
    "label": "gemini",
    "status": "active",
    "credentials": {
      "api_key": "AQ.Ab8RN6L-izkBQ8k03PNA4pOS6shLwJKGjBEQiDkflkeAPEzrxw"
    },
    "created_at": "2026-07-22T14:16:38.013Z"
  }
];

async function seed() {
  console.log("Creating api_keys table if not exists...");
  await sql`
    CREATE TABLE IF NOT EXISTS api_keys (
      id INTEGER PRIMARY KEY,
      provider_name TEXT NOT NULL,
      label TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      credentials JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  console.log(`Inserting ${RAW_KEYS.length} Gemini API keys...`);
  let inserted = 0;
  for (const item of RAW_KEYS) {
    await sql`
      INSERT INTO api_keys (id, provider_name, label, status, credentials, created_at)
      VALUES (${item.id}, ${item.provider_name}, ${item.label}, ${item.status}, ${JSON.stringify(item.credentials)}, ${item.created_at})
      ON CONFLICT (id) DO UPDATE SET
        provider_name = EXCLUDED.provider_name,
        label = EXCLUDED.label,
        status = EXCLUDED.status,
        credentials = EXCLUDED.credentials,
        created_at = EXCLUDED.created_at;
    `;
    inserted++;
  }
  console.log(`Successfully upserted ${inserted} keys in Neon PostgreSQL!`);

  // Also collect all active keys as newline separated string and sync into app_settings
  const allGeminiKeyStrings = RAW_KEYS
    .filter(k => k.status === 'active' && k.credentials?.api_key)
    .map(k => k.credentials.api_key.trim());
  
  const geminiKeysCombined = allGeminiKeyStrings.join("\n");

  console.log("Updating app_settings with the new geminiKeys pool...");
  const existingSettingsRes = await sql`SELECT data FROM app_settings WHERE id = 'main_settings' LIMIT 1`;
  let currentSettings: any = {};
  if (existingSettingsRes.length > 0 && existingSettingsRes[0].data) {
    currentSettings = existingSettingsRes[0].data;
  }

  const updatedSettings = {
    ...currentSettings,
    geminiKeys: geminiKeysCombined,
    geminiModel: currentSettings.geminiModel || "gemini-2.5-flash",
  };

  await sql`
    INSERT INTO app_settings (id, data, updated_at)
    VALUES ('main_settings', ${JSON.stringify(updatedSettings)}, NOW())
    ON CONFLICT (id) DO UPDATE SET
      data = EXCLUDED.data,
      updated_at = NOW();
  `;

  console.log("Database seed & settings sync complete! ✨");
}

seed().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});

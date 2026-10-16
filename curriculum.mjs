import {VI_LESSON_UPGRADES} from './vietnamese-grammar.mjs?v=vi-connectors-v1';
// Original teaching units. Stages are internal learning guidance, not certified exam equivalences.
export const LESSONS = [
  {
    "id": "vi-01",
    "language": "vi",
    "order": 1,
    "stage": "Khởi đầu",
    "title": "Âm, dấu và lời chào",
    "goal": "Nhận biết dấu thanh; chào hỏi và tự giới thiệu bằng hai câu.",
    "minutes": 15,
    "words": [
      {
        "term": "xin chào",
        "meaning": "hello",
        "pinyin": ""
      },
      {
        "term": "cảm ơn",
        "meaning": "thank you",
        "pinyin": ""
      },
      {
        "term": "tạm biệt",
        "meaning": "goodbye",
        "pinyin": ""
      },
      {
        "term": "tôi",
        "meaning": "I",
        "pinyin": ""
      },
      {
        "term": "bạn",
        "meaning": "you",
        "pinyin": ""
      },
      {
        "term": "người",
        "meaning": "person",
        "pinyin": ""
      }
    ],
    "grammar": [
      {
        "pattern": "Chủ ngữ + là + danh từ",
        "note": "Dùng là để giới thiệu tên, nghề nghiệp hoặc quan hệ. Xưng hô thay đổi theo tuổi và quan hệ; tôi/bạn là điểm bắt đầu, không phù hợp mọi tình huống.",
        "example": "Tôi là An.",
        "meaning": "I am An.",
        "question": "Tôi ___ An.",
        "answer": "là"
      },
      {
        "pattern": "Dấu thanh thuộc về âm tiết",
        "note": "Tiếng Việt viết thanh ngang, huyền, sắc, hỏi, ngã, nặng. Ví dụ ma/mà/má/mả/mã/mạ là các âm tiết khác nhau. Cần học cả âm và dấu; hỏi/ngã có thể khác nhau theo vùng.",
        "example": "Bạn là người Việt Nam.",
        "meaning": "You are Vietnamese.",
        "question": "Điền đại từ ngôi thứ nhất: ___ là An.",
        "answer": "tôi"
      }
    ],
    "reading": "Xin chào! Tôi là An. Bạn là người Việt Nam. Cảm ơn bạn!",
    "translation": "Hello! I am An. You are Vietnamese. Thank you!",
    "writing": "Viết 2–3 câu chào và giới thiệu tên của bạn.",
    "prerequisite": null
  },
  {
    "id": "vi-02",
    "language": "vi",
    "order": 2,
    "stage": "Khởi đầu",
    "title": "Gia đình và giới thiệu người thân",
    "goal": "Giới thiệu thành viên gia đình và hỏi danh tính.",
    "minutes": 15,
    "words": [
      {
        "term": "mẹ",
        "meaning": "mother",
        "pinyin": ""
      },
      {
        "term": "bố",
        "meaning": "father",
        "pinyin": ""
      },
      {
        "term": "anh trai",
        "meaning": "older brother",
        "pinyin": ""
      },
      {
        "term": "chị gái",
        "meaning": "older sister",
        "pinyin": ""
      },
      {
        "term": "gia đình",
        "meaning": "family",
        "pinyin": ""
      },
      {
        "term": "em gái",
        "meaning": "younger sister",
        "pinyin": ""
      }
    ],
    "grammar": [
      {
        "pattern": "Danh từ + của + người sở hữu",
        "note": "Của nối vật/người với chủ sở hữu. Có thể lược của trong các quan hệ gần gũi như mẹ tôi.",
        "example": "Đây là mẹ của tôi.",
        "meaning": "This is my mother.",
        "question": "Đây là mẹ ___ tôi.",
        "answer": "của"
      },
      {
        "pattern": "Ai? / Đây là ai?",
        "note": "Ai thay cho người cần hỏi. Giữ từ hỏi ở vị trí thông tin cần biết. Đây dùng để chỉ người hoặc vật ở gần.",
        "example": "Đây là ai? Đây là chị gái tôi.",
        "meaning": "Who is this? This is my older sister.",
        "question": "Đây là ___? — Đây là mẹ tôi.",
        "answer": "ai"
      }
    ],
    "reading": "Đây là gia đình tôi. Đây là bố tôi và đây là mẹ tôi. Chị gái tôi là giáo viên.",
    "translation": "This is my family. This is my father and this is my mother. My older sister is a teacher.",
    "writing": "Giới thiệu ba người trong gia đình; nêu quan hệ và một thông tin về mỗi người.",
    "prerequisite": "vi-01"
  },
  {
    "id": "vi-03",
    "language": "vi",
    "order": 3,
    "stage": "Khởi đầu",
    "title": "Số đếm, đồ vật và câu hỏi",
    "goal": "Đếm đồ vật quen thuộc và hỏi có/không.",
    "minutes": 15,
    "words": [
      {
        "term": "một",
        "meaning": "one",
        "pinyin": ""
      },
      {
        "term": "hai",
        "meaning": "two",
        "pinyin": ""
      },
      {
        "term": "ba",
        "meaning": "three",
        "pinyin": ""
      },
      {
        "term": "cái",
        "meaning": "general classifier",
        "pinyin": ""
      },
      {
        "term": "quyển sách",
        "meaning": "book",
        "pinyin": ""
      },
      {
        "term": "cây bút",
        "meaning": "pen",
        "pinyin": ""
      }
    ],
    "grammar": [
      {
        "pattern": "Số + loại từ + danh từ",
        "note": "Loại từ đi với từng nhóm danh từ: hai quyển sách, ba cây bút. Không dùng cái cho mọi danh từ.",
        "example": "Tôi có hai quyển sách.",
        "meaning": "I have two books.",
        "question": "Tôi có hai ___ sách.",
        "answer": "quyển"
      },
      {
        "pattern": "Có + danh từ + không?",
        "note": "Hỏi sự sở hữu bằng có…không. Trả lời có hoặc không có. Không đặt là trước có.",
        "example": "Bạn có bút không?",
        "meaning": "Do you have a pen?",
        "question": "Bạn có bút ___?",
        "answer": "không"
      }
    ],
    "reading": "Tôi có hai quyển sách và ba cây bút. Bạn có sách không? Tôi có một quyển sách.",
    "translation": "I have two books and three pens. Do you have a book? I have one book.",
    "writing": "Mô tả các đồ vật trong cặp bằng ít nhất ba số đếm.",
    "prerequisite": "vi-02"
  },
  {
    "id": "vi-04",
    "language": "vi",
    "order": 4,
    "stage": "Sơ cấp",
    "title": "Một ngày của tôi",
    "goal": "Nói về thói quen và phân biệt thời gian với dấu thể.",
    "minutes": 15,
    "words": [
      {
        "term": "buổi sáng",
        "meaning": "morning",
        "pinyin": ""
      },
      {
        "term": "học",
        "meaning": "study",
        "pinyin": ""
      },
      {
        "term": "ăn",
        "meaning": "eat",
        "pinyin": ""
      },
      {
        "term": "uống",
        "meaning": "drink",
        "pinyin": ""
      },
      {
        "term": "ngủ",
        "meaning": "sleep",
        "pinyin": ""
      },
      {
        "term": "hôm qua",
        "meaning": "yesterday",
        "pinyin": ""
      }
    ],
    "grammar": [
      {
        "pattern": "Thời gian + chủ ngữ + hoạt động",
        "note": "Đặt thời gian đầu câu hoặc sau chủ ngữ. Từ chỉ thời gian thường đã đủ để xác định lúc xảy ra; không phải mọi câu đều cần đã/đang/sẽ.",
        "example": "Buổi sáng, tôi học tiếng Việt.",
        "meaning": "In the morning, I study Vietnamese.",
        "question": "Buổi sáng, tôi ___ tiếng Việt.",
        "answer": "học"
      },
      {
        "pattern": "Đã / đang / sẽ + động từ",
        "note": "Đã thường nhìn sự việc như đã xảy ra, đang nhấn mạnh diễn tiến, sẽ hướng tới tương lai. Chúng không phải hệ chia thì giống tiếng Anh.",
        "example": "Tôi đang uống nước.",
        "meaning": "I am drinking water.",
        "question": "Diễn tả hành động đang diễn ra: Tôi ___ uống nước.",
        "answer": "đang"
      }
    ],
    "reading": "Buổi sáng, tôi ăn bánh mì và uống nước. Buổi chiều, tôi học tiếng Việt. Bây giờ tôi đang đọc sách.",
    "translation": "In the morning I eat bread and drink water. In the afternoon I study Vietnamese. Now I am reading a book.",
    "writing": "Viết 5 câu về một ngày của bạn; thêm một việc đang diễn ra.",
    "prerequisite": "vi-03"
  },
  {
    "id": "vi-05",
    "language": "vi",
    "order": 5,
    "stage": "Sơ cấp",
    "title": "Mua sắm và gọi món",
    "goal": "Hỏi giá, yêu cầu lịch sự và mô tả món ăn.",
    "minutes": 15,
    "words": [
      {
        "term": "bao nhiêu",
        "meaning": "how much / how many",
        "pinyin": ""
      },
      {
        "term": "tiền",
        "meaning": "money",
        "pinyin": ""
      },
      {
        "term": "phở",
        "meaning": "pho noodle soup",
        "pinyin": ""
      },
      {
        "term": "ngon",
        "meaning": "delicious",
        "pinyin": ""
      },
      {
        "term": "đắt",
        "meaning": "expensive",
        "pinyin": ""
      },
      {
        "term": "rẻ",
        "meaning": "cheap",
        "pinyin": ""
      }
    ],
    "grammar": [
      {
        "pattern": "Danh từ + bao nhiêu tiền?",
        "note": "Hỏi giá bằng bao nhiêu tiền. Khi mua hàng, thêm xưng hô và ạ nếu phù hợp để tăng tính lịch sự.",
        "example": "Bát phở này bao nhiêu tiền?",
        "meaning": "How much is this bowl of pho?",
        "question": "Bát phở này ___ tiền?",
        "answer": "bao nhiêu"
      },
      {
        "pattern": "Cho + người nhận + danh từ",
        "note": "Trong yêu cầu dịch vụ, cho tôi… diễn đạt mong muốn nhận món hàng. Xin/ạ giúp câu nhẹ nhàng hơn. Tính từ thường làm vị ngữ trực tiếp, không cần là.",
        "example": "Cho tôi một bát phở, ạ. Phở ngon.",
        "meaning": "A bowl of pho, please. Pho is delicious.",
        "question": "Cho tôi một ___ phở, ạ.",
        "answer": "bát"
      }
    ],
    "reading": "Chào cô! Cho tôi một bát phở, ạ. Bát phở này bao nhiêu tiền? Phở rất ngon, cảm ơn cô!",
    "translation": "Hello! A bowl of pho, please. How much is this bowl? The pho is very good, thank you!",
    "writing": "Viết hội thoại 6 lượt giữa khách và người bán: gọi món, hỏi giá, cảm ơn.",
    "prerequisite": "vi-04"
  },
  {
    "id": "vi-06",
    "language": "vi",
    "order": 6,
    "stage": "Sơ cấp",
    "title": "Đi lại và vị trí",
    "goal": "Hỏi đường; diễn đạt vị trí và lời đề nghị.",
    "minutes": 15,
    "words": [
      {
        "term": "ở đâu",
        "meaning": "where",
        "pinyin": ""
      },
      {
        "term": "bên trái",
        "meaning": "on the left",
        "pinyin": ""
      },
      {
        "term": "bên phải",
        "meaning": "on the right",
        "pinyin": ""
      },
      {
        "term": "đi thẳng",
        "meaning": "go straight",
        "pinyin": ""
      },
      {
        "term": "nhà ga",
        "meaning": "station",
        "pinyin": ""
      },
      {
        "term": "gần",
        "meaning": "near",
        "pinyin": ""
      }
    ],
    "grammar": [
      {
        "pattern": "Danh từ + ở + vị trí",
        "note": "Ở làm vị ngữ chỉ vị trí; ở đâu hỏi nơi chốn. Đừng dùng là để nối người/vật với vị trí trong mẫu này.",
        "example": "Nhà ga ở bên trái.",
        "meaning": "The station is on the left.",
        "question": "Nhà ga ___ bên trái.",
        "answer": "ở"
      },
      {
        "pattern": "Hãy + động từ / đừng + động từ",
        "note": "Hãy đưa ra lời chỉ dẫn; đừng khuyên tránh một hành động. Khi hỏi người lạ, có thể dùng làm ơn hoặc cho tôi hỏi.",
        "example": "Hãy đi thẳng. Đừng rẽ trái.",
        "meaning": "Go straight. Do not turn left.",
        "question": "Khuyên không rẽ trái: ___ rẽ trái.",
        "answer": "đừng"
      }
    ],
    "reading": "Cho tôi hỏi, nhà ga ở đâu? Hãy đi thẳng rồi rẽ phải. Nhà ga ở gần công viên. Cảm ơn bạn!",
    "translation": "Excuse me, where is the station? Go straight and then turn right. The station is near the park. Thank you!",
    "writing": "Hướng dẫn đường từ nhà bạn đến một địa điểm trong 5–6 câu.",
    "prerequisite": "vi-05"
  },
  {
    "id": "vi-07",
    "language": "vi",
    "order": 7,
    "stage": "Trung cấp",
    "title": "So sánh và lựa chọn",
    "goal": "So sánh hai phương án và giải thích lựa chọn.",
    "minutes": 25,
    "words": [
      {
        "term": "hơn",
        "meaning": "more than",
        "pinyin": ""
      },
      {
        "term": "nhất",
        "meaning": "most / -est",
        "pinyin": ""
      },
      {
        "term": "bằng",
        "meaning": "as … as",
        "pinyin": ""
      },
      {
        "term": "lựa chọn",
        "meaning": "choice",
        "pinyin": ""
      },
      {
        "term": "thuận tiện",
        "meaning": "convenient",
        "pinyin": ""
      },
      {
        "term": "yên tĩnh",
        "meaning": "quiet",
        "pinyin": ""
      }
    ],
    "grammar": [
      {
        "pattern": "A + tính từ + hơn + B",
        "note": "Hơn đứng sau tính từ, trước đối tượng so sánh. Nhất thể hiện mức cao nhất trong một nhóm xác định.",
        "example": "Xe buýt rẻ hơn taxi.",
        "meaning": "The bus is cheaper than a taxi.",
        "question": "Xe buýt rẻ ___ taxi.",
        "answer": "hơn"
      },
      {
        "pattern": "A + không + tính từ + bằng + B",
        "note": "Không…bằng so sánh mức thấp hơn. Tránh lặp thêm hơn sau bằng trong cùng cấu trúc.",
        "example": "Phòng này không yên tĩnh bằng phòng kia.",
        "meaning": "This room is not as quiet as that room.",
        "question": "Phòng này không yên tĩnh ___ phòng kia.",
        "answer": "bằng"
      }
    ],
    "reading": "Xe buýt rẻ hơn taxi nhưng đi chậm hơn. Taxi thuận tiện hơn khi có nhiều hành lý. Tôi chọn xe buýt vì muốn tiết kiệm tiền.",
    "translation": "The bus is cheaper than a taxi but slower. A taxi is more convenient with much luggage. I choose the bus to save money.",
    "writing": "So sánh hai cách đi học hoặc hai nơi ở; nêu lựa chọn và hai lý do.",
    "prerequisite": "vi-06"
  },
  {
    "id": "vi-08",
    "language": "vi",
    "order": 8,
    "stage": "Trung cấp",
    "title": "Kể trải nghiệm và nguyên nhân",
    "goal": "Liên kết sự kiện; kể trải nghiệm có kết quả.",
    "minutes": 25,
    "words": [
      {
        "term": "trải nghiệm",
        "meaning": "experience",
        "pinyin": ""
      },
      {
        "term": "đã từng",
        "meaning": "have ever",
        "pinyin": ""
      },
      {
        "term": "bởi vì",
        "meaning": "because",
        "pinyin": ""
      },
      {
        "term": "vì vậy",
        "meaning": "therefore",
        "pinyin": ""
      },
      {
        "term": "tuy nhiên",
        "meaning": "however",
        "pinyin": ""
      },
      {
        "term": "kết quả",
        "meaning": "result",
        "pinyin": ""
      }
    ],
    "grammar": [
      {
        "pattern": "Đã từng + động từ",
        "note": "Đã từng nói về trải nghiệm trước thời điểm hiện tại. Phủ định thường dùng chưa từng. Không cần thêm một mốc thời gian cụ thể.",
        "example": "Tôi đã từng đến Huế.",
        "meaning": "I have been to Hue.",
        "question": "Tôi chưa ___ đến Huế.",
        "answer": "từng"
      },
      {
        "pattern": "Vì…nên… / tuy…nhưng…",
        "note": "Vì…nên nối nguyên nhân–kết quả; tuy…nhưng nối sự tương phản. Chủ ngữ hai vế có thể khác nhau nhưng phải rõ quan hệ.",
        "example": "Vì trời mưa nên tôi ở nhà.",
        "meaning": "Because it was raining, I stayed home.",
        "question": "Vì trời mưa ___ tôi ở nhà.",
        "answer": "nên"
      }
    ],
    "reading": "Tôi đã từng đến Huế vào mùa mưa. Tuy trời mưa nhưng chuyến đi vẫn thú vị. Vì đường trơn nên chúng tôi đi chậm.",
    "translation": "I have visited Hue in the rainy season. Although it rained, the trip was interesting. Because the road was slippery, we walked slowly.",
    "writing": "Kể một trải nghiệm trong 80–100 từ, dùng một quan hệ nguyên nhân và một tương phản.",
    "prerequisite": "vi-07"
  },
  {
    "id": "vi-09",
    "language": "vi",
    "order": 9,
    "stage": "Trung cấp",
    "title": "Giả thiết và quan hệ trong câu",
    "goal": "Diễn đạt điều kiện; bổ nghĩa danh từ bằng mệnh đề.",
    "minutes": 25,
    "words": [
      {
        "term": "nếu",
        "meaning": "if",
        "pinyin": ""
      },
      {
        "term": "thì",
        "meaning": "then",
        "pinyin": ""
      },
      {
        "term": "điều kiện",
        "meaning": "condition",
        "pinyin": ""
      },
      {
        "term": "cơ hội",
        "meaning": "opportunity",
        "pinyin": ""
      },
      {
        "term": "quyển sách",
        "meaning": "book",
        "pinyin": ""
      },
      {
        "term": "người bạn",
        "meaning": "friend",
        "pinyin": ""
      }
    ],
    "grammar": [
      {
        "pattern": "Nếu…thì…",
        "note": "Nếu đặt điều kiện; thì giới thiệu kết quả và có thể được lược trong một số ngữ cảnh. Dùng ngữ cảnh để phân biệt giả thiết thực tế với giả định.",
        "example": "Nếu có thời gian thì tôi sẽ đọc sách.",
        "meaning": "If I have time, I will read.",
        "question": "Nếu có thời gian ___ tôi sẽ đọc sách.",
        "answer": "thì"
      },
      {
        "pattern": "Danh từ + mà + mệnh đề",
        "note": "Mệnh đề sau mà bổ nghĩa cho danh từ. Mà có thể được lược ở nhiều câu nhưng giữ lại thường giúp người học nhìn rõ quan hệ.",
        "example": "Đây là quyển sách mà tôi thích.",
        "meaning": "This is the book that I like.",
        "question": "Đây là quyển sách ___ tôi thích.",
        "answer": "mà"
      }
    ],
    "reading": "Đây là quyển sách mà người bạn của tôi giới thiệu. Nếu có thời gian thì tôi sẽ đọc hết trong tuần này. Tôi muốn trao đổi với bạn về những ý tưởng trong sách.",
    "translation": "This is the book my friend recommended. If I have time, I will finish it this week. I want to discuss the ideas in it with my friend.",
    "writing": "Viết về một kế hoạch có điều kiện và một người hoặc vật quan trọng với kế hoạch đó.",
    "prerequisite": "vi-08"
  },
  {
    "id": "vi-10",
    "language": "vi",
    "order": 10,
    "stage": "Nâng cao",
    "title": "Điểm nhìn, bị động và lời kể",
    "goal": "Chọn được, bị và cách dẫn lại ý kiến theo ngữ cảnh.",
    "minutes": 25,
    "words": [
      {
        "term": "được",
        "meaning": "receive / be allowed",
        "pinyin": ""
      },
      {
        "term": "bị",
        "meaning": "undergo (often adverse)",
        "pinyin": ""
      },
      {
        "term": "thông báo",
        "meaning": "announcement",
        "pinyin": ""
      },
      {
        "term": "ý kiến",
        "meaning": "opinion",
        "pinyin": ""
      },
      {
        "term": "cho rằng",
        "meaning": "hold the view that",
        "pinyin": ""
      },
      {
        "term": "cho biết",
        "meaning": "report / state",
        "pinyin": ""
      }
    ],
    "grammar": [
      {
        "pattern": "Bị / được + tác nhân + động từ",
        "note": "Bị thường thể hiện việc bất lợi, được thường biểu thị lợi ích, sự cho phép hoặc cơ hội. Không phải mọi bị/được đều là bị động; nên xét cả nghĩa câu.",
        "example": "Tôi được cô giáo khen.",
        "meaning": "I was praised by the teacher.",
        "question": "Tôi ___ cô giáo khen.",
        "answer": "được"
      },
      {
        "pattern": "Người nói + cho biết / cho rằng + mệnh đề",
        "note": "Cho biết dẫn thông tin, cho rằng dẫn nhận định. Khi thuật lại, kiểm tra đại từ và mốc thời gian theo điểm nhìn mới.",
        "example": "Cô giáo cho biết lớp học bắt đầu lúc tám giờ.",
        "meaning": "The teacher said that class starts at eight.",
        "question": "Dẫn một nhận định: Lan cho ___ học nhóm rất hữu ích.",
        "answer": "rằng"
      }
    ],
    "reading": "Tôi được cô giáo giao nhiệm vụ giới thiệu sách. Cô cho biết mỗi nhóm có năm phút trình bày. Tôi cho rằng cách học này giúp cả lớp trao đổi nhiều hơn.",
    "translation": "The teacher assigned me to introduce a book. She said each group has five minutes. I think this approach helps everyone exchange more ideas.",
    "writing": "Thuật lại một thông báo và một ý kiến; chỉ rõ đâu là sự kiện, đâu là nhận định.",
    "prerequisite": "vi-09"
  },
  {
    "id": "vi-11",
    "language": "vi",
    "order": 11,
    "stage": "Nâng cao",
    "title": "Lập luận và nhượng bộ",
    "goal": "Viết đoạn có luận điểm, lý do, phản biện và giới hạn.",
    "minutes": 25,
    "words": [
      {
        "term": "luận điểm",
        "meaning": "claim",
        "pinyin": ""
      },
      {
        "term": "bằng chứng",
        "meaning": "evidence",
        "pinyin": ""
      },
      {
        "term": "mặc dù",
        "meaning": "although",
        "pinyin": ""
      },
      {
        "term": "dù",
        "meaning": "even though",
        "pinyin": ""
      },
      {
        "term": "không những",
        "meaning": "not only",
        "pinyin": ""
      },
      {
        "term": "mặt khác",
        "meaning": "on the other hand",
        "pinyin": ""
      }
    ],
    "grammar": [
      {
        "pattern": "Mặc dù…nhưng…",
        "note": "Mệnh đề nhượng bộ công nhận một thực tế nhưng cho thấy kết quả trái kỳ vọng. Tránh dùng vì…nên khi ý định là tương phản.",
        "example": "Mặc dù học trực tuyến linh hoạt nhưng cần tính tự giác.",
        "meaning": "Although online learning is flexible, it requires self-discipline.",
        "question": "Mặc dù thuận tiện ___ cách học này vẫn có hạn chế.",
        "answer": "nhưng"
      },
      {
        "pattern": "Không những…mà còn…",
        "note": "Hai vế bổ sung theo hướng tăng tiến, nên song song về cấu trúc. Có thể dùng không chỉ…mà còn… với ý nghĩa gần nhau.",
        "example": "Đọc sách không những mở rộng vốn từ mà còn rèn tư duy.",
        "meaning": "Reading not only builds vocabulary but also develops thinking.",
        "question": "Không những mở rộng vốn từ ___ còn rèn tư duy.",
        "answer": "mà"
      }
    ],
    "reading": "Học trực tuyến không những tiết kiệm thời gian mà còn mở rộng cơ hội học tập. Mặc dù vậy, người học cần tự quản lý tiến độ. Vì thế, lựa chọn phương pháp phải xét cả hoàn cảnh và mục tiêu.",
    "translation": "Online learning saves time and broadens opportunities. Nevertheless, learners must manage their progress. Therefore the method should reflect circumstances and goals.",
    "writing": "Viết 150–200 từ về học trực tuyến: luận điểm, bằng chứng hoặc ví dụ, phản biện và kết luận có giới hạn.",
    "prerequisite": "vi-10"
  },
  {
    "id": "vi-12",
    "language": "vi",
    "order": 12,
    "stage": "Nâng cao",
    "title": "Sắc thái và văn phong học thuật",
    "goal": "Diễn đạt thận trọng, phân biệt nghĩa sự việc và thái độ người nói.",
    "minutes": 25,
    "words": [
      {
        "term": "có lẽ",
        "meaning": "perhaps",
        "pinyin": ""
      },
      {
        "term": "dường như",
        "meaning": "seemingly",
        "pinyin": ""
      },
      {
        "term": "xét về",
        "meaning": "with regard to",
        "pinyin": ""
      },
      {
        "term": "nhìn chung",
        "meaning": "overall",
        "pinyin": ""
      },
      {
        "term": "hạn chế",
        "meaning": "limitation",
        "pinyin": ""
      },
      {
        "term": "quan điểm",
        "meaning": "viewpoint",
        "pinyin": ""
      }
    ],
    "grammar": [
      {
        "pattern": "Có lẽ / dường như + mệnh đề",
        "note": "Có lẽ đánh dấu phỏng đoán; dường như đánh dấu ấn tượng hoặc suy luận. Hai từ này không thay thế bằng chứng; hãy nêu căn cứ và mức độ chắc chắn phù hợp.",
        "example": "Dường như kết quả phụ thuộc vào thời gian luyện tập.",
        "meaning": "The result seems to depend on practice time.",
        "question": "Diễn tả phỏng đoán: Có ___ kết quả sẽ thay đổi.",
        "answer": "lẽ"
      },
      {
        "pattern": "Xét về… / đối với…",
        "note": "Đưa một phương diện hoặc đối tượng lên đầu để xác lập phạm vi nhận định. Giữ rõ chủ thể và tránh câu dài thiếu vị ngữ.",
        "example": "Xét về chi phí, phương án này phù hợp hơn.",
        "meaning": "In terms of cost, this option is more suitable.",
        "question": "Xét ___ chi phí, phương án này phù hợp hơn.",
        "answer": "về"
      }
    ],
    "reading": "Xét về chi phí, học trực tuyến có nhiều lợi thế. Tuy nhiên, dường như mức độ tương tác còn phụ thuộc vào cách tổ chức lớp. Nhìn chung, cần đánh giá nhiều phương diện trước khi kết luận.",
    "translation": "Online study has cost advantages. However, interaction seems to depend on class design. Overall, several aspects should be assessed before drawing conclusions.",
    "writing": "Viết 200–250 từ đánh giá một giải pháp; nêu nguồn ví dụ, một giới hạn và kết luận thận trọng.",
    "prerequisite": "vi-11"
  },
  {
    "id": "zh-01",
    "language": "zh",
    "order": 1,
    "stage": "Khởi đầu",
    "title": "Pinyin, thanh điệu và chào hỏi",
    "goal": "Nhận biết bốn thanh và thanh nhẹ; tự giới thiệu bằng 是.",
    "minutes": 15,
    "words": [
      {
        "term": "你好",
        "meaning": "hello",
        "pinyin": "nǐ hǎo"
      },
      {
        "term": "谢谢",
        "meaning": "thank you",
        "pinyin": "xièxie"
      },
      {
        "term": "我",
        "meaning": "I",
        "pinyin": "wǒ"
      },
      {
        "term": "你",
        "meaning": "you",
        "pinyin": "nǐ"
      },
      {
        "term": "是",
        "meaning": "be",
        "pinyin": "shì"
      },
      {
        "term": "学生",
        "meaning": "student",
        "pinyin": "xuésheng"
      }
    ],
    "grammar": [
      {
        "pattern": "Chủ ngữ + 是 + danh từ",
        "note": "是 nối chủ ngữ với danh từ, không dùng để nối mọi tính từ. Pinyin ghi thanh trên nguyên âm; thanh nhẹ không có dấu. Học nǐ hǎo: âm đầu thường biến điệu gần ní khi nói liền, chữ vẫn viết 你好.",
        "example": "我是学生。",
        "meaning": "I am a student.",
        "question": "我___学生。",
        "answer": "是"
      },
      {
        "pattern": "Không: 不 + động từ",
        "note": "不 thường phủ định thói quen, ý muốn hoặc nhận định; 不是 phủ định nhận diện. 不 trước thanh 4 thường đọc bú, nhưng dạng từ điển là bù.",
        "example": "我不是老师。",
        "meaning": "I am not a teacher.",
        "question": "我___是老师。",
        "answer": "不"
      }
    ],
    "reading": "你好！我是学生。我不是老师。你也是学生吗？",
    "translation": "Hello! I am a student. I am not a teacher. Are you also a student?",
    "writing": "Viết 3 câu chữ Hán giới thiệu mình; có thể thêm pinyin để tự luyện phát âm.",
    "prerequisite": null
  },
  {
    "id": "zh-02",
    "language": "zh",
    "order": 2,
    "stage": "Khởi đầu",
    "title": "Tên gọi, gia đình và sở hữu",
    "goal": "Hỏi tên và giới thiệu người thân bằng 的.",
    "minutes": 15,
    "words": [
      {
        "term": "名字",
        "meaning": "name",
        "pinyin": "míngzi"
      },
      {
        "term": "妈妈",
        "meaning": "mother",
        "pinyin": "māma"
      },
      {
        "term": "爸爸",
        "meaning": "father",
        "pinyin": "bàba"
      },
      {
        "term": "朋友",
        "meaning": "friend",
        "pinyin": "péngyou"
      },
      {
        "term": "家",
        "meaning": "home",
        "pinyin": "jiā"
      },
      {
        "term": "谁",
        "meaning": "who",
        "pinyin": "shéi"
      }
    ],
    "grammar": [
      {
        "pattern": "Người sở hữu + 的 + danh từ",
        "note": "的 nối phần bổ nghĩa với danh từ. Với quan hệ thân thuộc như 我妈妈, 的 thường có thể lược.",
        "example": "这是我的朋友。",
        "meaning": "This is my friend.",
        "question": "这是我___朋友。",
        "answer": "的"
      },
      {
        "pattern": "Từ hỏi giữ vị trí câu trả lời",
        "note": "谁 hỏi người, 什么 hỏi sự vật/tên. Không thêm 吗 vào câu đã có từ hỏi theo mẫu thông thường này.",
        "example": "你叫什么名字？",
        "meaning": "What is your name?",
        "question": "你叫___名字？",
        "answer": "什么"
      }
    ],
    "reading": "我叫安。这是我妈妈。那是我的朋友。你叫什么名字？",
    "translation": "My name is An. This is my mother. That is my friend. What is your name?",
    "writing": "Giới thiệu tên và hai người thân bằng 4 câu; dùng 的 ít nhất một lần.",
    "prerequisite": "zh-01"
  },
  {
    "id": "zh-03",
    "language": "zh",
    "order": 3,
    "stage": "Khởi đầu",
    "title": "Số đếm, lượng từ và có/không",
    "goal": "Đếm đồ vật bằng lượng từ phù hợp và phủ định 有.",
    "minutes": 15,
    "words": [
      {
        "term": "一",
        "meaning": "one",
        "pinyin": "yī"
      },
      {
        "term": "两",
        "meaning": "two",
        "pinyin": "liǎng"
      },
      {
        "term": "个",
        "meaning": "general classifier",
        "pinyin": "gè"
      },
      {
        "term": "本",
        "meaning": "book classifier",
        "pinyin": "běn"
      },
      {
        "term": "书",
        "meaning": "book",
        "pinyin": "shū"
      },
      {
        "term": "有",
        "meaning": "have",
        "pinyin": "yǒu"
      }
    ],
    "grammar": [
      {
        "pattern": "Số + lượng từ + danh từ",
        "note": "Dùng 两 trước lượng từ khi đếm hai vật: 两本书. 二 dùng trong chuỗi số và nhiều cách đọc số; không thay 两 cho mọi trường hợp.",
        "example": "我有两本书。",
        "meaning": "I have two books.",
        "question": "我有两___书。",
        "answer": "本"
      },
      {
        "pattern": "Phủ định 有 bằng 没有",
        "note": "Không dùng 不有. Câu hỏi 有…吗 hoặc 有没有… hỏi sự hiện hữu hoặc sở hữu.",
        "example": "我没有书。你有书吗？",
        "meaning": "I have no book. Do you have a book?",
        "question": "我___有书。",
        "answer": "没"
      }
    ],
    "reading": "我有两本书。你有书吗？我没有书，但是我有一个本子。",
    "translation": "I have two books. Do you have a book? I have no book, but I have a notebook.",
    "writing": "Liệt kê 4 đồ vật bạn có/không có; dùng số và lượng từ.",
    "prerequisite": "zh-02"
  },
  {
    "id": "zh-04",
    "language": "zh",
    "order": 4,
    "stage": "Sơ cấp",
    "title": "Lịch sinh hoạt và thời gian",
    "goal": "Nói lúc nào làm việc gì; phân biệt 在 vị trí và tiến hành.",
    "minutes": 15,
    "words": [
      {
        "term": "今天",
        "meaning": "today",
        "pinyin": "jīntiān"
      },
      {
        "term": "明天",
        "meaning": "tomorrow",
        "pinyin": "míngtiān"
      },
      {
        "term": "学习",
        "meaning": "study",
        "pinyin": "xuéxí"
      },
      {
        "term": "早上",
        "meaning": "morning",
        "pinyin": "zǎoshang"
      },
      {
        "term": "喝水",
        "meaning": "drink water",
        "pinyin": "hē shuǐ"
      },
      {
        "term": "学校",
        "meaning": "school",
        "pinyin": "xuéxiào"
      }
    ],
    "grammar": [
      {
        "pattern": "Chủ ngữ + thời gian + động từ",
        "note": "Thời gian thường đứng trước động từ, sau chủ ngữ hoặc đầu câu; không đặt lịch thời gian sau động từ theo mẫu này.",
        "example": "我今天学习中文。",
        "meaning": "I study Chinese today.",
        "question": "我___学习中文。（today）",
        "answer": "今天"
      },
      {
        "pattern": "在 + nơi chốn / 在 + động từ",
        "note": "在学校 chỉ vị trí, 在学习 nhấn mạnh hoạt động đang diễn ra. Có thể kết hợp 我在学校学习.",
        "example": "我在喝水。",
        "meaning": "I am drinking water.",
        "question": "我___喝水。（đang）",
        "answer": "在"
      }
    ],
    "reading": "我早上去学校。我今天学习中文。现在我在喝水，朋友在看书。",
    "translation": "I go to school in the morning. I study Chinese today. Now I am drinking water, and my friend is reading.",
    "writing": "Viết 5 câu về lịch hôm nay; có một câu hành động đang diễn ra.",
    "prerequisite": "zh-03"
  },
  {
    "id": "zh-05",
    "language": "zh",
    "order": 5,
    "stage": "Sơ cấp",
    "title": "Ăn uống và mua hàng",
    "goal": "Gọi món, hỏi giá và dùng tính từ làm vị ngữ.",
    "minutes": 15,
    "words": [
      {
        "term": "米饭",
        "meaning": "cooked rice",
        "pinyin": "mǐfàn"
      },
      {
        "term": "面条",
        "meaning": "noodles",
        "pinyin": "miàntiáo"
      },
      {
        "term": "水",
        "meaning": "water",
        "pinyin": "shuǐ"
      },
      {
        "term": "多少钱",
        "meaning": "how much money",
        "pinyin": "duōshao qián"
      },
      {
        "term": "好吃",
        "meaning": "delicious",
        "pinyin": "hǎochī"
      },
      {
        "term": "想",
        "meaning": "want / would like",
        "pinyin": "xiǎng"
      }
    ],
    "grammar": [
      {
        "pattern": "想 + động từ",
        "note": "想 diễn đạt mong muốn làm một việc. Với yêu cầu mua hàng, 我要… cũng thường gặp; 请给我… diễn đạt yêu cầu nhận món.",
        "example": "我想吃面条。",
        "meaning": "I would like to eat noodles.",
        "question": "我___吃面条。（muốn）",
        "answer": "想"
      },
      {
        "pattern": "Chủ ngữ + 很 + tính từ",
        "note": "Câu miêu tả trung tính thường dùng 很 trước tính từ; 很 không phải lúc nào cũng nhấn mạnh rất. Không dùng 是好吃 trong mẫu này.",
        "example": "面条很好吃。",
        "meaning": "The noodles are delicious.",
        "question": "面条___好吃。（mẫu miêu tả trung tính）",
        "answer": "很"
      }
    ],
    "reading": "我想吃面条，也想喝水。这碗面条多少钱？面条很好吃，谢谢！",
    "translation": "I would like noodles and water. How much is this bowl of noodles? The noodles are delicious, thank you!",
    "writing": "Viết hội thoại gọi món 6 lượt; hỏi giá và nhận xét món ăn.",
    "prerequisite": "zh-04"
  },
  {
    "id": "zh-06",
    "language": "zh",
    "order": 6,
    "stage": "Sơ cấp",
    "title": "Vị trí và đi lại",
    "goal": "Nêu vị trí, đích đến và yêu cầu lịch sự.",
    "minutes": 15,
    "words": [
      {
        "term": "哪里",
        "meaning": "where",
        "pinyin": "nǎlǐ"
      },
      {
        "term": "左边",
        "meaning": "left side",
        "pinyin": "zuǒbian"
      },
      {
        "term": "右边",
        "meaning": "right side",
        "pinyin": "yòubian"
      },
      {
        "term": "车站",
        "meaning": "station",
        "pinyin": "chēzhàn"
      },
      {
        "term": "去",
        "meaning": "go",
        "pinyin": "qù"
      },
      {
        "term": "请问",
        "meaning": "excuse me (asking)",
        "pinyin": "qǐngwèn"
      }
    ],
    "grammar": [
      {
        "pattern": "Ở đâu: 在哪里？",
        "note": "在 nối đối tượng với vị trí. 哪里 và 哪儿 đều hỏi nơi chốn, khác nhau chủ yếu về thói quen vùng miền.",
        "example": "车站在哪里？",
        "meaning": "Where is the station?",
        "question": "车站___哪里？",
        "answer": "在"
      },
      {
        "pattern": "去 + đích đến + hoạt động",
        "note": "Đặt nơi đến sau 去, rồi thêm hoạt động. 请 + động từ làm lời đề nghị; 请问 mở đầu câu hỏi lịch sự.",
        "example": "我去学校学习。",
        "meaning": "I go to school to study.",
        "question": "我___学校学习。（đi）",
        "answer": "去"
      }
    ],
    "reading": "请问，车站在哪里？车站在学校的右边。我去车站坐车。谢谢你！",
    "translation": "Excuse me, where is the station? It is to the right of the school. I go to the station to take a bus. Thank you!",
    "writing": "Mô tả đường đến trường bằng 5 câu; thêm một câu hỏi lịch sự.",
    "prerequisite": "zh-05"
  },
  {
    "id": "zh-07",
    "language": "zh",
    "order": 7,
    "stage": "Trung cấp",
    "title": "Trải nghiệm: 了 và 过",
    "goal": "Phân biệt việc hoàn thành với trải nghiệm đã có.",
    "minutes": 25,
    "words": [
      {
        "term": "昨天",
        "meaning": "yesterday",
        "pinyin": "zuótiān"
      },
      {
        "term": "以前",
        "meaning": "previously",
        "pinyin": "yǐqián"
      },
      {
        "term": "已经",
        "meaning": "already",
        "pinyin": "yǐjīng"
      },
      {
        "term": "旅行",
        "meaning": "travel",
        "pinyin": "lǚxíng"
      },
      {
        "term": "北京",
        "meaning": "Beijing",
        "pinyin": "Běijīng"
      },
      {
        "term": "电影",
        "meaning": "film",
        "pinyin": "diànyǐng"
      }
    ],
    "grammar": [
      {
        "pattern": "Động từ + 了: nhìn sự việc trọn vẹn",
        "note": "了 sau động từ thường đánh dấu thể hoàn thành, không phải dấu quá khứ dùng cho mọi câu. 了 cuối câu còn có chức năng biểu thị thay đổi tình huống.",
        "example": "昨天我买了一本书。",
        "meaning": "Yesterday I bought a book.",
        "question": "昨天我买___一本书。",
        "answer": "了"
      },
      {
        "pattern": "Động từ + 过: trải nghiệm",
        "note": "过 nói đã có trải nghiệm; phủ định thường 没（有）+ động từ + 过. Không dùng 不 để phủ định một trải nghiệm chưa có theo mẫu này.",
        "example": "我去过北京。",
        "meaning": "I have been to Beijing.",
        "question": "我没去___北京。",
        "answer": "过"
      }
    ],
    "reading": "我以前去过北京。昨天我看了一部介绍北京的电影。我想再去一次。",
    "translation": "I have been to Beijing before. Yesterday I watched a film about Beijing. I would like to go again.",
    "writing": "Viết 80–100 chữ Hán về trải nghiệm và một sự việc cụ thể; dùng 过 và 了 đúng ngữ cảnh.",
    "prerequisite": "zh-06"
  },
  {
    "id": "zh-08",
    "language": "zh",
    "order": 8,
    "stage": "Trung cấp",
    "title": "So sánh và bổ ngữ mức độ",
    "goal": "So sánh hai đối tượng và nói cách thực hiện hành động.",
    "minutes": 25,
    "words": [
      {
        "term": "比",
        "meaning": "than",
        "pinyin": "bǐ"
      },
      {
        "term": "更",
        "meaning": "even more",
        "pinyin": "gèng"
      },
      {
        "term": "一样",
        "meaning": "same",
        "pinyin": "yíyàng"
      },
      {
        "term": "快",
        "meaning": "fast",
        "pinyin": "kuài"
      },
      {
        "term": "慢",
        "meaning": "slow",
        "pinyin": "màn"
      },
      {
        "term": "清楚",
        "meaning": "clear",
        "pinyin": "qīngchu"
      }
    ],
    "grammar": [
      {
        "pattern": "A + 比 + B + tính từ",
        "note": "Đặt đối tượng B sau 比; không chèn 很 trước tính từ trong mẫu so sánh cơ bản. Có thể thêm 更 để nhấn mức hơn nữa.",
        "example": "火车比汽车快。",
        "meaning": "The train is faster than the car.",
        "question": "火车___汽车快。",
        "answer": "比"
      },
      {
        "pattern": "Động từ + 得 + bổ ngữ",
        "note": "得 nối động từ với cách thức hoặc mức độ. Phân biệt 的 bổ nghĩa danh từ, 得 sau động từ, 地 trước động từ trạng ngữ.",
        "example": "他说得很清楚。",
        "meaning": "He speaks very clearly.",
        "question": "他说___很清楚。",
        "answer": "得"
      }
    ],
    "reading": "火车比汽车快。我喜欢坐火车。朋友说得很清楚：坐火车也可以看风景。",
    "translation": "The train is faster than the car. I like taking trains. My friend says clearly that one can also enjoy scenery on a train.",
    "writing": "So sánh hai phương tiện, rồi miêu tả một người nói hoặc làm việc như thế nào.",
    "prerequisite": "zh-07"
  },
  {
    "id": "zh-09",
    "language": "zh",
    "order": 9,
    "stage": "Trung cấp",
    "title": "Nguyên nhân, điều kiện và nhượng bộ",
    "goal": "Liên kết lý do, giả thiết và kết quả trái kỳ vọng.",
    "minutes": 25,
    "words": [
      {
        "term": "因为",
        "meaning": "because",
        "pinyin": "yīnwèi"
      },
      {
        "term": "所以",
        "meaning": "therefore",
        "pinyin": "suǒyǐ"
      },
      {
        "term": "虽然",
        "meaning": "although",
        "pinyin": "suīrán"
      },
      {
        "term": "但是",
        "meaning": "but",
        "pinyin": "dànshì"
      },
      {
        "term": "如果",
        "meaning": "if",
        "pinyin": "rúguǒ"
      },
      {
        "term": "就",
        "meaning": "then",
        "pinyin": "jiù"
      }
    ],
    "grammar": [
      {
        "pattern": "因为…所以… / 虽然…但是…",
        "note": "Cặp đầu nối nguyên nhân–kết quả; cặp sau nối nhượng bộ. Tránh nhầm hai quan hệ chỉ vì cùng có hai mệnh đề.",
        "example": "虽然下雨，但是我还是去了学校。",
        "meaning": "Although it rained, I still went to school.",
        "question": "虽然下雨，___我还是去了学校。",
        "answer": "但是"
      },
      {
        "pattern": "如果…就…",
        "note": "就 thường đứng sau chủ ngữ ở vế kết quả. Đây là giả thiết; khác 只有…才… là điều kiện cần.",
        "example": "如果明天下雨，我就不去公园。",
        "meaning": "If it rains tomorrow, I will not go to the park.",
        "question": "如果明天下雨，我___不去公园。",
        "answer": "就"
      }
    ],
    "reading": "因为今天下雨，所以我们在家学习。虽然不能出去，但是大家很开心。如果明天天气好，我们就去公园。",
    "translation": "Because it rains today, we study at home. Although we cannot go out, everyone is happy. If the weather is good tomorrow, we will go to the park.",
    "writing": "Viết 100–150 chữ Hán về một kế hoạch thay đổi; dùng nguyên nhân và điều kiện.",
    "prerequisite": "zh-08"
  },
  {
    "id": "zh-10",
    "language": "zh",
    "order": 10,
    "stage": "Nâng cao",
    "title": "把, 被 và kết quả hành động",
    "goal": "Chọn câu xử trí hoặc bị động khi ngữ cảnh cần nhấn đối tượng.",
    "minutes": 25,
    "words": [
      {
        "term": "完成",
        "meaning": "complete",
        "pinyin": "wánchéng"
      },
      {
        "term": "作业",
        "meaning": "homework",
        "pinyin": "zuòyè"
      },
      {
        "term": "检查",
        "meaning": "check",
        "pinyin": "jiǎnchá"
      },
      {
        "term": "关上",
        "meaning": "close",
        "pinyin": "guānshàng"
      },
      {
        "term": "准备",
        "meaning": "prepare",
        "pinyin": "zhǔnbèi"
      },
      {
        "term": "结果",
        "meaning": "result",
        "pinyin": "jiéguǒ"
      }
    ],
    "grammar": [
      {
        "pattern": "Chủ ngữ + 把 + đối tượng xác định + động từ + kết quả",
        "note": "把 đưa đối tượng chịu tác động lên trước động từ. Cần có thông tin về kết quả, hướng, số lượng hoặc trạng thái; không dùng máy móc với mọi động từ.",
        "example": "我把作业写完了。",
        "meaning": "I finished the homework.",
        "question": "我___作业写完了。",
        "answer": "把"
      },
      {
        "pattern": "Đối tượng + 被 + tác nhân + động từ + phần bổ sung",
        "note": "被 chuyển điểm nhìn sang đối tượng chịu tác động. Tác nhân có thể lược khi không biết hoặc không quan trọng. 被 không bắt buộc luôn mang nghĩa xấu.",
        "example": "作业被老师检查过了。",
        "meaning": "The homework has been checked by the teacher.",
        "question": "作业___老师检查过了。",
        "answer": "被"
      }
    ],
    "reading": "我把作业写完了，也把书放进书包里。作业已经被老师检查过了。明天上课前，我还要复习一次。",
    "translation": "I finished the homework and put the books in my bag. The teacher has already checked the homework. Before class tomorrow I need to review once more.",
    "writing": "Kể một việc đã xử lý xong; dùng 把 một lần và giải thích lúc nào nên dùng 被.",
    "prerequisite": "zh-09"
  },
  {
    "id": "zh-11",
    "language": "zh",
    "order": 11,
    "stage": "Nâng cao",
    "title": "Lập luận và phản biện",
    "goal": "Trình bày ý kiến bằng quan hệ tăng tiến và điều kiện cần.",
    "minutes": 25,
    "words": [
      {
        "term": "不仅",
        "meaning": "not only",
        "pinyin": "bùjǐn"
      },
      {
        "term": "而且",
        "meaning": "moreover",
        "pinyin": "érqiě"
      },
      {
        "term": "只有",
        "meaning": "only if",
        "pinyin": "zhǐyǒu"
      },
      {
        "term": "才",
        "meaning": "only then",
        "pinyin": "cái"
      },
      {
        "term": "观点",
        "meaning": "viewpoint",
        "pinyin": "guāndiǎn"
      },
      {
        "term": "证据",
        "meaning": "evidence",
        "pinyin": "zhèngjù"
      }
    ],
    "grammar": [
      {
        "pattern": "不仅…而且…",
        "note": "Hai vế tăng tiến và nên song song. Cùng một chủ ngữ thường đặt chủ ngữ trước 不仅; chủ ngữ khác nhau thường đặt 不仅 trước chủ ngữ thứ nhất.",
        "example": "阅读不仅能增加词汇，而且能开阔眼界。",
        "meaning": "Reading builds vocabulary and also broadens horizons.",
        "question": "不仅能增加词汇，___能开阔眼界。",
        "answer": "而且"
      },
      {
        "pattern": "只有…才… và 只要…就…",
        "note": "只有 nêu điều kiện cần; 只要 nêu điều kiện đủ trong phát biểu của người nói. Không thay hai cặp tùy tiện: chỉ có X mới Y khác hễ X thì Y.",
        "example": "只有认真练习，才能取得进步。",
        "meaning": "Only with serious practice can one make progress.",
        "question": "只有认真练习，___能取得进步。",
        "answer": "才"
      }
    ],
    "reading": "阅读不仅能增加词汇，而且能帮助我们理解不同的观点。不过，只有主动思考，才能把信息变成自己的知识。例子和证据同样重要。",
    "translation": "Reading builds vocabulary and helps us understand different views. However, only by thinking actively can we turn information into our own knowledge. Examples and evidence are equally important.",
    "writing": "Viết 180–250 chữ Hán về thói quen học tập: luận điểm, lý do, phản biện và kết luận.",
    "prerequisite": "zh-10"
  },
  {
    "id": "zh-12",
    "language": "zh",
    "order": 12,
    "stage": "Nâng cao",
    "title": "Văn phong thận trọng và cấu trúc nâng cao",
    "goal": "Giới hạn khẳng định, nêu đối chiếu và suy luận có căn cứ.",
    "minutes": 25,
    "words": [
      {
        "term": "未必",
        "meaning": "not necessarily",
        "pinyin": "wèibì"
      },
      {
        "term": "似乎",
        "meaning": "seemingly",
        "pinyin": "sìhū"
      },
      {
        "term": "即使",
        "meaning": "even if",
        "pinyin": "jíshǐ"
      },
      {
        "term": "仍然",
        "meaning": "still",
        "pinyin": "réngrán"
      },
      {
        "term": "局限",
        "meaning": "limitation",
        "pinyin": "júxiàn"
      },
      {
        "term": "相比之下",
        "meaning": "by comparison",
        "pinyin": "xiāngbǐ zhī xià"
      }
    ],
    "grammar": [
      {
        "pattern": "即使…也… so với 虽然…但是…",
        "note": "即使 thường dựng giả định hoặc nhấn trường hợp cực đoan; 虽然 thường công nhận một thực tế. 也 đặt trước vị ngữ của vế kết quả.",
        "example": "即使时间有限，我们也应该认真检查。",
        "meaning": "Even if time is limited, we should still check carefully.",
        "question": "即使时间有限，我们___应该认真检查。",
        "answer": "也"
      },
      {
        "pattern": "未必 / 似乎 + vị ngữ",
        "note": "未必 giảm tính tất yếu: không chắc đã; 似乎 đánh dấu ấn tượng hoặc suy đoán. Trình bày căn cứ thay vì biến suy đoán thành sự thật chắc chắn.",
        "example": "价格高未必代表质量好。",
        "meaning": "A high price does not necessarily mean good quality.",
        "question": "价格高___代表质量好。（không nhất thiết）",
        "answer": "未必"
      }
    ],
    "reading": "在线学习似乎更灵活，但灵活未必意味着效果更好。即使资源丰富，学习者也需要清晰的目标。相比之下，固定的学习安排有时更有帮助。",
    "translation": "Online study seems more flexible, but flexibility does not necessarily mean better results. Even with rich resources, learners need clear goals. By comparison, a fixed schedule may sometimes help more.",
    "writing": "Viết 250–350 chữ Hán đánh giá một cách học; nêu điều kiện áp dụng và giới hạn của kết luận.",
    "prerequisite": "zh-11"
  }
];

for(const lesson of LESSONS){const upgrade=VI_LESSON_UPGRADES[lesson.id];if(!upgrade)continue;lesson.grammar.push(...upgrade.grammar);const seen=new Set(lesson.words.map(w=>w.term));for(const word of upgrade.words)if(!seen.has(word.term)){lesson.words.push(word);seen.add(word.term);}lesson.workshop=upgrade.workshop;lesson.minutes+=10;lesson.writing+=' Yêu cầu liên kết: '+upgrade.workshop.task;}
export const SOURCES = [
 {title:'Tạp chí Khoa học ĐHSP TP.HCM — chức năng giới từ và phân biệt liên từ',url:'https://journal.hcmue.edu.vn/index.php/hcmuejos/article/view/1213',note:'Đối chiếu sự khác biệt giữa chức năng liên kết và cách phân loại từ. Sổ tay dùng “từ nối” theo chức năng, không coi mọi mục là cùng một từ loại.'},
 {title:'MIT OpenCourseWare — Learning Chinese: A Foundation Course in Mandarin',url:'https://www.ocw.mit.edu/courses/res-21g-003-learning-chinese-a-foundation-course-in-mandarin-spring-2011/pages/online-textbook/part-ii-units-5-7-character-lessons-4-6/',note:'Đối chiếu lộ trình từ phát âm, bổ ngữ 得, trải nghiệm 过 đến liên kết câu. Ví dụ và bài đọc trong app được biên soạn riêng.'},
 {title:'Khung năng lực tiếng Việt dùng cho người nước ngoài (Bộ GD&ĐT)',url:'https://vbpl.vn/TW/Pages/vbpq-toanvan.aspx?ItemID=128668',note:'Tham khảo tiến trình năng lực giao tiếp; bài học do Little Lingua biên soạn, không phải toàn bộ chương trình chứng chỉ.'},
 {title:'Chinese Tests Service — syllabus and grammar',url:'https://www.chinesetest.cn/syllabus',note:'Tham khảo cách kết hợp nhiệm vụ, chủ đề, từ vựng và ngữ pháp; không gán tương đương HSK cho các chặng nội bộ.'},
 {title:'Council of Europe — CEFR Companion Volume',url:'https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-companion-volume-and-its-language-versions',note:'Tham khảo mục tiêu có thể thực hiện và tiến trình từ câu đơn đến lập luận. Không phải chứng nhận CEFR.'}
];
export function normalizeAnswer(text){return String(text||'').normalize('NFC').toLocaleLowerCase().replace(/[.,!?。！？;；:："“”]/gu,'').replace(/\s+/gu,' ').trim();}
export function acceptedMeanings(text){return [...new Set([normalizeAnswer(text),...String(text).split(/\s*[/;]\s*/u).map(normalizeAnswer)])].filter(Boolean);}
export function shuffled(items, random=Math.random){const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
export function scrambleWord(term,random=Math.random){const chars=Array.from(term.normalize('NFC'));const out=shuffled(chars,random);if(out.join('')===term&&new Set(chars).size>1){const j=chars.findIndex(c=>c!==chars[0]);[out[0],out[j]]=[out[j],out[0]];}return out.map(c=>c===' '?'␣':c).join(' · ');}
export function lessonVocabulary(lesson){return lesson.words.map((w,i)=>({id:`course-${lesson.id}-${i}`,vi:w.term,en:w.meaning,pinyin:w.pinyin,language:lesson.language,lessonId:lesson.id,categoryLabel:lesson.title}));}
export function vocabularyPool(language,existing=[]){const map=new Map();for(const w of existing){const key=normalizeAnswer(w.vi);if(!map.has(key))map.set(key,{...w,language,lessonIds:[]});}for(const l of LESSONS.filter(l=>l.language===language))for(const w of lessonVocabulary(l)){const key=normalizeAnswer(w.vi);if(map.has(key))map.get(key).lessonIds.push(l.id);else map.set(key,{...w,lessonIds:[l.id]});}return [...map.values()];}
export function gradeQuestions(questions,answers){return questions.map((q,i)=>({...q,response:answers[i]||'',correct:q.type==='meaning'?acceptedMeanings(q.answer||q.word.en).includes(normalizeAnswer(answers[i])):normalizeAnswer(answers[i])===normalizeAnswer(q.word.vi)}));}
export const GLOSSES_VI = Object.fromEntries(`hello|xin chào
thank you|cảm ơn
goodbye|tạm biệt
good morning|chào buổi sáng
good night|chúc ngủ ngon
sorry|xin lỗi
it is okay|không sao
please|làm ơn
you are welcome|không có gì
friend|bạn / người bạn
one|một
two|hai
three|ba
four|bốn
five|năm
six|sáu
seven|bảy
eight|tám
nine|chín
ten|mười
cat|mèo
dog|chó
rabbit|thỏ
panda|gấu trúc
tiger|hổ
elephant|voi
monkey|khỉ
bird|chim
fish|cá
frog|ếch
mother|mẹ
father|bố / cha
older brother|anh trai
older sister|chị gái
younger brother|em trai
younger sister|em gái
grandmother|bà
grandfather|ông
home|nhà
baby|em bé
apple|táo
banana|chuối
strawberry|dâu tây
watermelon|dưa hấu
grape|nho
orange|cam
peach|đào
pear|lê
red|đỏ
blue|xanh dương / xanh da trời
green|xanh lá / xanh lá cây
yellow|vàng
white|trắng
black|đen
purple|tím
pink|hồng
book|sách
pen|bút
pencil|bút chì
teacher|giáo viên / thầy giáo / cô giáo
student|học sinh / sinh viên
school|trường học
table|bàn
chair|ghế
sun|mặt trời
moon|mặt trăng
star|ngôi sao / sao
flower|hoa
tree|cây
water|nước
rain|mưa
mountain|núi
happy|vui / vui vẻ
sad|buồn
tired|mệt
hungry|đói
thirsty|khát
love|yêu / tình yêu
I|tôi / mình
you|bạn
be|là
name|tên
who|ai
general classifier|lượng từ chung
book classifier|lượng từ cho sách
have|có
today|hôm nay
tomorrow|ngày mai
study|học
morning|buổi sáng
drink water|uống nước
cooked rice|cơm
noodles|mì / mì sợi
how much money|bao nhiêu tiền
delicious|ngon
want / would like|muốn
where|ở đâu
left side|bên trái
right side|bên phải
station|nhà ga / trạm
go|đi
excuse me (asking)|xin hỏi / cho hỏi
yesterday|hôm qua
previously|trước đây
already|đã
travel|du lịch
Beijing|Bắc Kinh
film|phim
than|hơn
even more|càng hơn / hơn nữa
same|giống nhau
fast|nhanh
slow|chậm
clear|rõ / rõ ràng
because|bởi vì / vì
therefore|vì vậy / cho nên
although|mặc dù / tuy
but|nhưng
if|nếu
then|thì
complete|hoàn thành
homework|bài tập về nhà
check|kiểm tra
close|đóng
prepare|chuẩn bị
result|kết quả
not only|không những / không chỉ
moreover|hơn nữa / mà còn
only if|chỉ khi / chỉ có
only then|mới / khi đó mới
viewpoint|quan điểm
evidence|bằng chứng
not necessarily|không nhất thiết / chưa chắc
seemingly|dường như
even if|ngay cả khi / dù cho
still|vẫn / vẫn còn
limitation|hạn chế
by comparison|so với / khi so sánh`.split('\n').map(line=>line.split('|')));
export function buildTest({language,words,types,count=10,writing='',title='Bài kiểm tra',answerLanguage='en'},random=Math.random){
 if(!['vi','zh'].includes(language))throw Error('Chọn tiếng Việt hoặc tiếng Trung.');
 if(!Number.isInteger(count)||count<1||count>50)throw Error('Số từ phải từ 1 đến 50.');
 if(!Array.isArray(words)||words.length<count)throw Error('Hãy chọn đủ từ hoặc giảm số từ.');
 if(!types.length&&!writing.trim())throw Error('Chọn ít nhất một dạng câu hỏi hoặc phần viết.');
 if(types.some(t=>!['meaning','scramble'].includes(t))||(language==='zh'&&types.includes('scramble')))throw Error('Tráo từ chỉ dành cho tiếng Việt.');
 const picked=shuffled(words,random).slice(0,count),questions=[];
 for(const word of picked)for(const type of types){
  const answer=type==='meaning'?(language==='zh'&&answerLanguage==='vi'?GLOSSES_VI[word.en]:word.en):word.vi;
  if(!answer)throw Error('Một từ chưa có nghĩa trong ngôn ngữ trả lời đã chọn.');
  questions.push({type,word:{id:word.id,vi:word.vi,en:word.en,pinyin:word.pinyin||''},answer,prompt:type==='scramble'?scrambleWord(word.vi,random):word.vi});
 }
 return {version:1,id:`test-${Date.now()}-${Math.floor(random()*1e9)}`,title:title.trim().slice(0,100)||'Bài kiểm tra',language,answerLanguage,createdAt:new Date().toISOString(),questions:shuffled(questions,random),writing:writing.trim().slice(0,1000),count:picked.length};
}
export function validateTest(raw){
 if(!raw||raw.version!==1||!['vi','zh'].includes(raw.language)||!Array.isArray(raw.questions)||raw.questions.length>100||typeof raw.writing!=='string'||raw.writing.length>1000)throw Error('File bài kiểm tra không hợp lệ.');
 if(!raw.questions.length&&!raw.writing.trim())throw Error('Bài kiểm tra trống.');
 const questions=raw.questions.map(q=>{
  if(!q||!['meaning','scramble'].includes(q.type)||(raw.language==='zh'&&q.type==='scramble')||!q.word||typeof q.word.vi!=='string'||!q.word.vi.trim()||q.word.vi.length>200||typeof q.word.en!=='string'||q.word.en.length>500||typeof q.answer!=='string'||!q.answer.trim()||q.answer.length>500||typeof q.prompt!=='string'||q.prompt.length>1000)throw Error('Dữ liệu câu hỏi không hợp lệ.');
  return {type:q.type,word:{id:String(q.word.id||'').slice(0,150),vi:q.word.vi,en:q.word.en,pinyin:String(q.word.pinyin||'').slice(0,200)},answer:q.answer,prompt:q.prompt};
 });
 return {version:1,id:`test-${Date.now()}-${Math.random().toString(36).slice(2)}`,title:String(raw.title||'Bài nhập').slice(0,100),language:raw.language,answerLanguage:raw.answerLanguage==='vi'?'vi':'en',createdAt:new Date().toISOString(),questions,writing:raw.writing,count:new Set(questions.map(q=>q.word.vi)).size};
}

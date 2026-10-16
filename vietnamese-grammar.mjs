// Original grammar expansions; functional labels, not a rigid word-class taxonomy.
export const VI_LESSON_UPGRADES = {
  "vi-01": {
    "grammar": [
      {
        "pattern": "Và: thêm hai ý ngang hàng",
        "note": "Và nối các từ, cụm từ hoặc vế câu cùng vai trò. Chỉ nối những ý thực sự có quan hệ; không bắt buộc đặt và ở đầu mọi câu.",
        "example": "Tôi là An và bạn tôi là Bình.",
        "meaning": "I am An and my friend is Binh.",
        "question": "Nối hai người: An ___ Bình là bạn.",
        "answer": "và"
      },
      {
        "pattern": "Cũng: thêm một trường hợp tương tự",
        "note": "Cũng thường đứng trước vị ngữ: tôi cũng là học sinh. Đây là từ đánh dấu sự tương đồng, không đứng thay và giữa hai danh từ trong mẫu An và Bình.",
        "example": "Tôi là học sinh. Bình cũng là học sinh.",
        "meaning": "I am a student. Binh is also a student.",
        "question": "Tôi là học sinh. Bình ___ là học sinh.",
        "answer": "cũng"
      }
    ],
    "words": [
      {
        "term": "và",
        "meaning": "and",
        "pinyin": ""
      },
      {
        "term": "cũng",
        "meaning": "also",
        "pinyin": ""
      }
    ],
    "workshop": {
      "before": "Tôi là An. Bạn tôi là Bình. Tôi là học sinh. Bình là học sinh.",
      "after": "Tôi là An và bạn tôi là Bình. Tôi là học sinh. Bình cũng là học sinh.",
      "reason": "Và gộp hai lời giới thiệu; cũng báo rằng Bình có cùng đặc điểm với tôi. Không cần nối tất cả thành một câu dài.",
      "task": "Viết lại 4 câu giới thiệu thành 2–3 câu; dùng và một lần và cũng một lần."
    }
  },
  "vi-02": {
    "grammar": [
      {
        "pattern": "Còn: chuyển sang đối tượng để đối chiếu",
        "note": "Còn thường chuyển đề tài sang người/vật khác: tôi…, còn em tôi…. Hai vế không cần đối lập gay gắt. Tránh nhầm với còn chỉ sự tiếp diễn trong tôi còn đang học.",
        "example": "Bố tôi là bác sĩ, còn mẹ tôi là giáo viên.",
        "meaning": "My father is a doctor, while my mother is a teacher.",
        "question": "Bố là bác sĩ, ___ mẹ là giáo viên.",
        "answer": "còn"
      },
      {
        "pattern": "Nhưng: nêu ý khác với điều có thể mong đợi",
        "note": "Nhưng nối hai ý tương phản hoặc hạn chế lẫn nhau. Chọn vì…nên khi muốn nói nguyên nhân; không chọn nhưng chỉ vì hai vế có hai người khác nhau.",
        "example": "Em tôi còn nhỏ nhưng rất tự lập.",
        "meaning": "My younger sibling is young but very independent.",
        "question": "Em còn nhỏ ___ rất tự lập.",
        "answer": "nhưng"
      }
    ],
    "words": [
      {
        "term": "còn",
        "meaning": "as for / while",
        "pinyin": ""
      },
      {
        "term": "nhưng",
        "meaning": "but",
        "pinyin": ""
      }
    ],
    "workshop": {
      "before": "Bố tôi làm ở bệnh viện. Mẹ tôi dạy học. Em tôi còn nhỏ. Em rất tự lập.",
      "after": "Bố tôi làm ở bệnh viện, còn mẹ tôi dạy học. Em tôi còn nhỏ nhưng rất tự lập.",
      "reason": "Còn chuyển đối tượng từ bố sang mẹ; nhưng thể hiện sự tự lập trái với điều người đọc có thể dự đoán từ tuổi nhỏ.",
      "task": "Giới thiệu hai người thân bằng còn; thêm một câu tương phản bằng nhưng."
    }
  },
  "vi-03": {
    "grammar": [
      {
        "pattern": "Hay / hoặc: đưa ra lựa chọn",
        "note": "Hay thường dùng trong câu hỏi lựa chọn: trà hay nước? Hoặc thường nêu các khả năng trong câu trần thuật. Hay còn có nghĩa thường xuyên hoặc giỏi, nên phải xem ngữ cảnh.",
        "example": "Bạn chọn sách hay bút? Bạn có thể chọn sách hoặc bút.",
        "meaning": "Do you choose a book or a pen? You may choose a book or a pen.",
        "question": "Hoàn thành câu hỏi lựa chọn bằng hay: Bạn chọn sách ___ bút?",
        "answer": "hay"
      },
      {
        "pattern": "Cả…lẫn…: bao gồm đồng thời hai đối tượng",
        "note": "Cả A lẫn B nhấn mạnh cả hai đều có đặc điểm hoặc tham gia hành động; không phải chọn một trong hai. Giữ hai phần cân xứng.",
        "example": "Tôi mang cả sách lẫn bút.",
        "meaning": "I bring both books and pens.",
        "question": "Tôi mang cả sách ___ bút.",
        "answer": "lẫn"
      }
    ],
    "words": [
      {
        "term": "hoặc",
        "meaning": "or",
        "pinyin": ""
      },
      {
        "term": "cả…lẫn…",
        "meaning": "both … and …",
        "pinyin": ""
      }
    ],
    "workshop": {
      "before": "Tôi có sách. Tôi có bút. Bạn muốn mượn sách? Bạn muốn mượn bút?",
      "after": "Tôi có cả sách lẫn bút. Bạn muốn mượn sách hay bút?",
      "reason": "Cả…lẫn khẳng định có đủ hai thứ; hay yêu cầu người nghe chọn. Thay hay bằng và sẽ làm thay đổi yêu cầu.",
      "task": "Viết một câu hỏi lựa chọn và một câu khẳng định có cả hai đồ vật."
    }
  },
  "vi-04": {
    "grammar": [
      {
        "pattern": "Trước khi / sau khi: xác lập mốc thời gian",
        "note": "Sau trước khi/sau khi có thể là một hoạt động hay mệnh đề. Khi hai hành động khác chủ thể, nêu rõ chủ ngữ để tránh hiểu lầm.",
        "example": "Sau khi ăn sáng, tôi đi học.",
        "meaning": "After breakfast, I go to school.",
        "question": "Nêu việc xảy ra sau bữa sáng: ___ khi ăn sáng, tôi đi học.",
        "answer": "sau"
      },
      {
        "pattern": "Rồi / sau đó: kể việc theo thứ tự",
        "note": "Rồi nối các hoạt động kế tiếp trong câu; sau đó thường mở bước tiếp theo trong lời kể. Trình tự thời gian chưa đủ chứng minh quan hệ nguyên nhân.",
        "example": "Tôi đọc bài rồi làm bài tập. Sau đó, tôi nghỉ.",
        "meaning": "I read the lesson and then do the exercises. After that, I rest.",
        "question": "Tôi đọc bài ___ làm bài tập. (việc kế tiếp)",
        "answer": "rồi"
      }
    ],
    "words": [
      {
        "term": "trước khi",
        "meaning": "before",
        "pinyin": ""
      },
      {
        "term": "sau đó",
        "meaning": "after that",
        "pinyin": ""
      }
    ],
    "workshop": {
      "before": "Tôi ăn sáng. Tôi đi học. Tôi làm bài tập. Tôi nghỉ.",
      "after": "Sau khi ăn sáng, tôi đi học. Tôi đọc bài rồi làm bài tập. Sau đó, tôi nghỉ.",
      "reason": "Các dấu mốc giúp người đọc theo dõi thứ tự. Không thêm vì vậy nếu chưa có ý nghĩa kết quả.",
      "task": "Kể lịch một buổi học bằng trước khi, rồi và sau đó; tránh lặp sau đó ở mọi câu."
    }
  },
  "vi-05": {
    "grammar": [
      {
        "pattern": "Để: nói mục đích hướng tới",
        "note": "Để + hoạt động nêu mục đích. Phân biệt mục đích dự định với nguyên nhân đã dẫn tới sự việc. Vì còn có các cách dùng khác, nhưng trong đối chiếu này vì nêu lý do còn để nêu mục tiêu.",
        "example": "Tôi mua rau để nấu canh.",
        "meaning": "I buy vegetables to make soup.",
        "question": "Tôi mua rau ___ nấu canh. (mục đích)",
        "answer": "để"
      },
      {
        "pattern": "Bởi vì / vì: giải thích lý do",
        "note": "Vì/bởi vì có thể mở đầu vế nguyên nhân hoặc theo sau vế kết quả. Nếu đưa nguyên nhân lên trước, có thể dùng vì…nên…; không dùng vì…nhưng… để chỉ nguyên nhân–kết quả.",
        "example": "Tôi chọn món này vì nó ít cay.",
        "meaning": "I choose this dish because it is not very spicy.",
        "question": "Tôi chọn món này ___ nó ít cay. (dùng vì)",
        "answer": "vì"
      }
    ],
    "words": [
      {
        "term": "để",
        "meaning": "in order to",
        "pinyin": ""
      },
      {
        "term": "bởi vì",
        "meaning": "because",
        "pinyin": ""
      }
    ],
    "workshop": {
      "before": "Tôi mua rau. Tôi muốn nấu canh. Tôi chọn quán gần nhà. Tôi có ít thời gian.",
      "after": "Tôi mua rau để nấu canh. Tôi chọn quán gần nhà vì tôi có ít thời gian.",
      "reason": "Để trả lời nhằm làm gì; vì trả lời tại sao. Không phải hai từ thay thế tự do cho nhau.",
      "task": "Viết hai câu gọi món: một câu nêu mục đích bằng để, một câu nêu lý do bằng vì."
    }
  },
  "vi-06": {
    "grammar": [
      {
        "pattern": "Khi / trong khi: đặt hoạt động vào hoàn cảnh",
        "note": "Khi giới thiệu thời điểm hoặc hoàn cảnh; trong khi có thể chỉ hai việc đồng thời hoặc đối chiếu hai thực tế. Dựa vào nội dung để nhận ra cách dùng.",
        "example": "Trong khi tôi xem bản đồ, Lan hỏi đường.",
        "meaning": "While I look at the map, Lan asks for directions.",
        "question": "___ khi tôi xem bản đồ, Lan hỏi đường. (đồng thời)",
        "answer": "trong"
      },
      {
        "pattern": "Nếu…thì…: chỉ dẫn có điều kiện",
        "note": "Nếu nêu tình huống có thể xảy ra, thì nêu cách xử lý hoặc kết quả. Thì có thể lược khi câu vẫn rõ; không coi nó là bắt buộc trong mọi câu điều kiện.",
        "example": "Nếu đi xe buýt thì bạn xuống ở trạm tiếp theo.",
        "meaning": "If you take the bus, get off at the next stop.",
        "question": "Nếu đi xe buýt ___ bạn xuống ở trạm tiếp theo.",
        "answer": "thì"
      }
    ],
    "words": [
      {
        "term": "trong khi",
        "meaning": "while",
        "pinyin": ""
      },
      {
        "term": "nếu",
        "meaning": "if",
        "pinyin": ""
      }
    ],
    "workshop": {
      "before": "Bạn đến ngã tư. Bạn rẽ phải. Bạn đi xe buýt. Bạn xuống ở trạm tiếp theo.",
      "after": "Khi đến ngã tư, bạn rẽ phải. Nếu đi xe buýt thì bạn xuống ở trạm tiếp theo.",
      "reason": "Khi đặt một bước vào đúng thời điểm; nếu cho biết chỉ dẫn phụ thuộc vào phương tiện đã chọn.",
      "task": "Viết chỉ đường với một mốc khi và một tình huống nếu…thì…."
    }
  },
  "vi-07": {
    "grammar": [
      {
        "pattern": "Ngoài ra / hơn nữa: bổ sung và tăng sức nặng",
        "note": "Ngoài ra thêm một phương diện; hơn nữa thường đưa thêm lý do củng cố nhận định trước. Dùng đầu câu thường kèm dấu phẩy để tách phần chuyển tiếp.",
        "example": "Phòng này gần trường. Hơn nữa, giá thuê khá thấp.",
        "meaning": "This room is near school. Moreover, the rent is fairly low.",
        "question": "Phòng gần trường. ___ nữa, giá thuê khá thấp.",
        "answer": "hơn"
      },
      {
        "pattern": "Trái lại / trong khi đó: đối chiếu có căn cứ",
        "note": "Trong khi đó chuyển sang một thực tế khác, có thể đồng thời hoặc tương phản. Trái lại nhấn quan hệ ngược hướng; không dùng chỉ vì hai câu nói hai sự vật khác nhau.",
        "example": "Phòng A nhiều ánh sáng. Trái lại, phòng B khá tối.",
        "meaning": "Room A is bright. In contrast, room B is rather dark.",
        "question": "Phòng A sáng. Trái ___, phòng B khá tối.",
        "answer": "lại"
      }
    ],
    "words": [
      {
        "term": "ngoài ra",
        "meaning": "in addition",
        "pinyin": ""
      },
      {
        "term": "hơn nữa",
        "meaning": "moreover",
        "pinyin": ""
      }
    ],
    "workshop": {
      "before": "Phòng A gần trường. Phòng A rẻ. Phòng B xa trường. Phòng B yên tĩnh.",
      "after": "Phòng A gần trường. Hơn nữa, giá thuê khá thấp. Trong khi đó, phòng B xa hơn nhưng yên tĩnh hơn.",
      "reason": "Lý do bổ sung không bị trộn với ý đối chiếu. Sự so sánh cần cùng phương diện hoặc nêu rõ phương diện thay đổi.",
      "task": "So sánh hai nơi ở trong 6 câu, dùng một từ bổ sung và một từ đối chiếu."
    }
  },
  "vi-08": {
    "grammar": [
      {
        "pattern": "Vì vậy / do đó: nối từ nguyên nhân sang kết quả",
        "note": "Vì vậy, do đó thường dẫn câu hoặc vế nêu hệ quả của thông tin đã có. Không chọn chúng khi hai ý chỉ tương phản. Không phải việc xảy ra sau đều là hệ quả.",
        "example": "Đường bị ngập. Vì vậy, xe buýt đổi tuyến.",
        "meaning": "The road is flooded. Therefore the bus changes its route.",
        "question": "Đường bị ngập. Vì ___, xe buýt đổi tuyến.",
        "answer": "vậy"
      },
      {
        "pattern": "Nhờ…mà… / tại…nên…: nguyên nhân kèm thái độ",
        "note": "Nhờ thường nhìn nguyên nhân theo hướng có lợi; tại có thể hàm ý quy trách nhiệm trong lời nói. Vì/do trung tính hơn khi chưa muốn đánh giá. Đây là xu hướng sử dụng, không phải công thức cho mọi hoàn cảnh.",
        "example": "Nhờ bạn hướng dẫn mà tôi tìm được đường.",
        "meaning": "Thanks to your guidance, I found the way.",
        "question": "___ bạn hướng dẫn mà tôi tìm được đường. (biết ơn)",
        "answer": "nhờ"
      }
    ],
    "words": [
      {
        "term": "vì vậy",
        "meaning": "therefore",
        "pinyin": ""
      },
      {
        "term": "nhờ",
        "meaning": "thanks to",
        "pinyin": ""
      }
    ],
    "workshop": {
      "before": "Bạn chỉ đường cho tôi. Tôi đến đúng giờ. Đường bị ngập. Xe buýt đổi tuyến.",
      "after": "Nhờ bạn chỉ đường mà tôi đến đúng giờ. Một đoạn đường bị ngập. Vì vậy, xe buýt đổi tuyến.",
      "reason": "Nhờ bộc lộ sự ghi nhận đối với người giúp đỡ; vì vậy đánh dấu quan hệ nguyên nhân–kết quả giữa hai câu.",
      "task": "Kể trải nghiệm trong 80–100 từ; dùng nhờ, vì vậy và một câu có tuy…nhưng…."
    }
  },
  "vi-09": {
    "grammar": [
      {
        "pattern": "Chỉ khi…mới…: điều kiện cần",
        "note": "Chỉ khi A mới B trình bày A như điều kiện cần của B trong ngữ cảnh. Nếu A thì B thường đưa ra một giả thiết–kết quả; hai mẫu không đồng nghĩa trong mọi trường hợp.",
        "example": "Chỉ khi có thẻ, bạn mới vào được thư viện.",
        "meaning": "Only with a card can you enter the library.",
        "question": "Chỉ khi có thẻ, bạn ___ vào được thư viện.",
        "answer": "mới"
      },
      {
        "pattern": "Miễn là: điều kiện được chấp nhận",
        "note": "Miễn là thường đưa ra điều kiện đủ để người nói chấp nhận kết quả hoặc đề nghị trong hoàn cảnh đang bàn. Tránh nhầm với trừ khi, vốn nêu ngoại lệ.",
        "example": "Bạn có thể mượn sách, miễn là trả đúng hạn.",
        "meaning": "You may borrow the book provided that you return it on time.",
        "question": "Bạn được mượn sách, miễn ___ trả đúng hạn.",
        "answer": "là"
      }
    ],
    "words": [
      {
        "term": "chỉ khi",
        "meaning": "only when",
        "pinyin": ""
      },
      {
        "term": "miễn là",
        "meaning": "provided that",
        "pinyin": ""
      }
    ],
    "workshop": {
      "before": "Bạn muốn vào thư viện. Bạn cần có thẻ. Bạn muốn mượn sách. Bạn cần trả đúng hạn.",
      "after": "Chỉ khi có thẻ, bạn mới vào được thư viện. Bạn có thể mượn sách, miễn là trả đúng hạn.",
      "reason": "Câu đầu nhấn điều kiện cần để vào; câu sau nêu điều kiện chấp nhận cho việc mượn. Hai điều kiện gắn với hai hành động khác nhau.",
      "task": "Viết nội quy ngắn; đối chiếu nếu…thì…, chỉ khi…mới… và miễn là bằng ba tình huống rõ ràng."
    }
  },
  "vi-10": {
    "grammar": [
      {
        "pattern": "Theo… / tuy nhiên: tách nguồn tin khỏi nhận xét",
        "note": "Theo + nguồn nêu xuất xứ thông tin; tuy nhiên chuyển sang ý hạn chế hoặc tương phản. Theo tôi là ý kiến cá nhân; không được trình bày thành bằng chứng khách quan.",
        "example": "Theo thông báo, lớp học bắt đầu lúc tám giờ. Tuy nhiên, giờ kết thúc chưa được công bố.",
        "meaning": "According to the notice, class starts at eight. However, the end time has not been announced.",
        "question": "Theo thông báo, lớp bắt đầu lúc tám giờ. Tuy ___, giờ kết thúc chưa rõ.",
        "answer": "nhiên"
      },
      {
        "pattern": "Mặc dù thực tế / dù…vẫn… giả định hoặc nhấn mạnh",
        "note": "Mặc dù thường thừa nhận điều đã biết; dù có thể nêu giả định hay nhấn điều bất lợi. Dù trời có mưa, tôi vẫn đi là lời cam kết cho cả tình huống giả định; đọc theo ngữ cảnh, không phân loại cứng chỉ bằng một từ.",
        "example": "Dù trời có mưa, tôi vẫn đến lớp.",
        "meaning": "Even if it rains, I will still come to class.",
        "question": "Dù trời có mưa, tôi ___ đến lớp.",
        "answer": "vẫn"
      }
    ],
    "words": [
      {
        "term": "tuy nhiên",
        "meaning": "however",
        "pinyin": ""
      },
      {
        "term": "dù",
        "meaning": "even if / although",
        "pinyin": ""
      }
    ],
    "workshop": {
      "before": "Thông báo nói lớp bắt đầu lúc tám giờ. Tôi chưa biết giờ kết thúc. Có thể trời mưa. Tôi sẽ đến lớp.",
      "after": "Theo thông báo, lớp học bắt đầu lúc tám giờ. Tuy nhiên, giờ kết thúc chưa rõ. Dù trời có mưa, tôi vẫn đến lớp.",
      "reason": "Nguồn tin, giới hạn thông tin và lời cam kết được tách riêng. Không dùng tuy nhiên giữa hai câu không có quan hệ tương phản hay hạn chế.",
      "task": "Thuật lại thông báo rồi nêu một giới hạn bằng tuy nhiên; phân biệt rõ việc đã biết và giả định."
    }
  },
  "vi-11": {
    "grammar": [
      {
        "pattern": "Cụ thể / chẳng hạn: triển khai ý, đưa ví dụ",
        "note": "Cụ thể làm rõ nội dung khái quát; chẳng hạn giới thiệu một ví dụ trong nhiều khả năng. Một ví dụ chỉ minh họa, chưa tự chứng minh một kết luận bao quát.",
        "example": "Cần luyện đều đặn. Chẳng hạn, mỗi ngày có thể đọc một đoạn ngắn.",
        "meaning": "Regular practice is needed. For example, one can read a short passage every day.",
        "question": "Cần luyện đều. Chẳng ___, mỗi ngày đọc một đoạn ngắn.",
        "answer": "hạn"
      },
      {
        "pattern": "Nói cách khác / mặt khác: diễn đạt lại hay đổi phương diện",
        "note": "Nói cách khác trình bày lại cùng ý cho rõ hơn; mặt khác bổ sung một phương diện khác, có thể tạo thế cân nhắc. Không dùng nói cách khác để lén đưa một kết luận mới mạnh hơn.",
        "example": "Cần học chủ động. Nói cách khác, người học phải tự đặt câu hỏi.",
        "meaning": "Active learning is needed. In other words, learners must ask their own questions.",
        "question": "Nói cách ___, người học phải tự đặt câu hỏi.",
        "answer": "khác"
      }
    ],
    "words": [
      {
        "term": "chẳng hạn",
        "meaning": "for example",
        "pinyin": ""
      },
      {
        "term": "nói cách khác",
        "meaning": "in other words",
        "pinyin": ""
      }
    ],
    "workshop": {
      "before": "Học nhóm giúp luyện nói. Mỗi người có thể trình bày một ý. Học nhóm mất thời gian sắp xếp.",
      "after": "Học nhóm giúp luyện nói. Chẳng hạn, mỗi người có thể trình bày một ý. Mặt khác, nhóm cần thời gian thống nhất lịch học.",
      "reason": "Chẳng hạn dẫn minh họa cho lợi ích; mặt khác mở phương diện chi phí tổ chức. Hai phương diện làm lập luận cân bằng hơn.",
      "task": "Viết đoạn lập luận 150–200 từ; thêm ví dụ bằng chẳng hạn và cân nhắc phương diện khác bằng mặt khác."
    }
  },
  "vi-12": {
    "grammar": [
      {
        "pattern": "Tóm lại / nhìn chung: tổng kết hay khái quát có giới hạn",
        "note": "Tóm lại thu gọn những ý đã triển khai; nhìn chung nêu đánh giá tổng thể nhưng thường để chỗ cho ngoại lệ. Không thêm luận điểm hoàn toàn mới ở phần tóm lại.",
        "example": "Nhìn chung, kế hoạch khả thi. Tóm lại, cần thử ở quy mô nhỏ trước.",
        "meaning": "Overall, the plan is feasible. In summary, it should first be tested on a small scale.",
        "question": "Thu gọn các ý đã nêu: Tóm ___, cần thử ở quy mô nhỏ.",
        "answer": "lại"
      },
      {
        "pattern": "Bởi vậy / tuy vậy và kiểm soát mạch lập luận",
        "note": "Bởi vậy nối hệ quả hoặc suy luận; tuy vậy quay sang điểm nhượng bộ/hạn chế. Thay một từ có thể đảo quan hệ lập luận. Hạn chế lặp từ nối; dùng thêm phép thế rõ nghĩa và lặp từ khóa có chủ đích.",
        "example": "Dữ liệu còn ít. Bởi vậy, kết luận cần thận trọng.",
        "meaning": "The data are limited. Therefore the conclusion needs caution.",
        "question": "Dữ liệu còn ít. Bởi ___, kết luận cần thận trọng.",
        "answer": "vậy"
      }
    ],
    "words": [
      {
        "term": "tóm lại",
        "meaning": "in summary",
        "pinyin": ""
      },
      {
        "term": "nhìn chung",
        "meaning": "overall",
        "pinyin": ""
      }
    ],
    "workshop": {
      "before": "Lớp học trực tuyến linh hoạt. Một số bạn thiếu mạng ổn định. Cần thử ở quy mô nhỏ. Chưa thể áp dụng cho tất cả.",
      "after": "Lớp học trực tuyến linh hoạt. Tuy vậy, một số bạn chưa có mạng ổn định. Bởi vậy, nên thử ở quy mô nhỏ trước. Nhìn chung, chưa thể áp dụng cùng một cách cho tất cả.",
      "reason": "Tuy vậy nêu giới hạn của lợi ích; bởi vậy dẫn đề xuất dựa trên giới hạn đó. Nhìn chung khái quát vừa phải, tránh vượt quá thông tin đã nêu.",
      "task": "Biên tập đoạn 200–250 từ: mỗi từ nối phải có quan hệ rõ; bỏ ít nhất một từ nối thừa và chỉ rõ từ thay thế quy chiếu tới ai/cái gì."
    }
  }
};
export const CONNECTOR_GUIDE = [
  {
    "id": "add",
    "title": "Bổ sung và tăng tiến",
    "forms": [
      "và",
      "cũng",
      "ngoài ra",
      "hơn nữa",
      "không những…mà còn…"
    ],
    "use": "Thêm ý cùng hướng; chuyển từ liệt kê cơ bản đến lý do củng cố lập luận.",
    "contrast": "Và nối thành phần ngang hàng; cũng đứng trong câu để thêm trường hợp tương tự; hơn nữa thường tăng sức nặng cho ý trước.",
    "example": "Đọc sách mở rộng vốn từ. Hơn nữa, việc đọc đều giúp hình thành thói quen học.",
    "wrong": "Lan cũng Minh cùng đi học.",
    "repair": "Lan và Minh cùng đi học.",
    "reason": "Trong mẫu này, cần và để nối hai danh từ; cũng không đảm nhiệm vị trí đó.",
    "exercise": "Điền từ nối hai tên người: Lan ___ Minh cùng đi học.",
    "answers": [
      "và"
    ],
    "explanation": "Hai tên người cùng làm chủ thể; dùng và để nối ngang hàng.",
    "lessons": [
      "vi-01",
      "vi-07",
      "vi-11"
    ]
  },
  {
    "id": "choice",
    "title": "Lựa chọn hay bao gồm cả hai",
    "forms": [
      "hay",
      "hoặc",
      "hay là",
      "cả…lẫn…"
    ],
    "use": "Nêu phương án hoặc nhấn mạnh hai đối tượng đều được tính đến.",
    "contrast": "Hay thường hỏi sự lựa chọn; hoặc nêu khả năng. Cả…lẫn… bao gồm cả hai, không yêu cầu chỉ chọn một.",
    "example": "Bạn có thể học ở nhà hoặc ở thư viện. Cả hai nơi đều có ưu điểm.",
    "wrong": "Tôi có cả sách hoặc bút. (ý muốn nói có đủ hai thứ)",
    "repair": "Tôi có cả sách lẫn bút.",
    "reason": "Cặp cả…lẫn… phù hợp với ý bao gồm; hoặc sẽ chuyển sang quan hệ lựa chọn.",
    "exercise": "Điền theo ý có đủ hai thứ: Tôi mang cả sách ___ bút.",
    "answers": [
      "lẫn"
    ],
    "explanation": "Cả…lẫn… diễn đạt đồng thời hai đối tượng.",
    "lessons": [
      "vi-03"
    ]
  },
  {
    "id": "time",
    "title": "Thời gian và trình tự",
    "forms": [
      "trước khi",
      "sau khi",
      "khi",
      "trong khi",
      "rồi",
      "sau đó",
      "cuối cùng"
    ],
    "use": "Sắp xếp sự kiện hoặc chỉ hai việc xảy ra đồng thời.",
    "contrast": "Sau đó là bước kế tiếp; vì vậy là hệ quả. Hai sự kiện nối tiếp chưa đủ chứng minh nguyên nhân. Trong khi còn có nghĩa đối chiếu theo ngữ cảnh.",
    "example": "Sau khi đọc yêu cầu, tôi lập dàn ý rồi viết bài. Cuối cùng, tôi kiểm tra dấu câu.",
    "wrong": "Lan đang đọc, sau đó Minh đang viết. (ý muốn nói đồng thời)",
    "repair": "Trong khi Lan đọc, Minh viết.",
    "reason": "Dùng trong khi cho sự đồng thời; sau đó diễn đạt nối tiếp nên làm sai ý định.",
    "exercise": "Hai việc đồng thời: ___ khi Lan đọc, Minh viết.",
    "answers": [
      "trong"
    ],
    "explanation": "Trong khi đặt hai hành động trong cùng một khoảng thời gian.",
    "lessons": [
      "vi-04",
      "vi-06"
    ]
  },
  {
    "id": "cause",
    "title": "Nguyên nhân, kết quả và thái độ",
    "forms": [
      "vì…nên…",
      "bởi vì",
      "do đó",
      "vì vậy",
      "nhờ…mà…",
      "tại…nên…"
    ],
    "use": "Giải thích lý do, nêu hệ quả và nhận ra sắc thái đánh giá.",
    "contrast": "Vì/do thường trung tính hơn; nhờ thường ghi nhận tác động có lợi; tại có thể mang ý quy trách nhiệm. Trình tự thời gian không tự bảo đảm quan hệ nhân quả.",
    "example": "Nhờ cả nhóm chuẩn bị kỹ mà buổi thuyết trình diễn ra thuận lợi.",
    "wrong": "Vì đường bị ngập nhưng xe buýt đổi tuyến. (ý nguyên nhân–kết quả)",
    "repair": "Vì đường bị ngập nên xe buýt đổi tuyến.",
    "reason": "Nhưng đánh dấu tương phản, không biểu đạt đúng kết quả dự kiến trong ngữ cảnh này.",
    "exercise": "Vì đường bị ngập ___ xe buýt đổi tuyến.",
    "answers": [
      "nên",
      "cho nên"
    ],
    "explanation": "Nên/cho nên mở vế hệ quả của nguyên nhân vừa nêu.",
    "lessons": [
      "vi-05",
      "vi-08"
    ]
  },
  {
    "id": "purpose",
    "title": "Mục đích và phương tiện",
    "forms": [
      "để",
      "nhằm",
      "bằng cách"
    ],
    "use": "Nêu mục tiêu hướng tới hoặc cách thức đạt mục tiêu.",
    "contrast": "Để/nhằm nêu mục tiêu; bằng cách nêu phương thức. Kết quả mong muốn có thể chưa xảy ra, nên không coi mục đích là bằng chứng kết quả đã đạt.",
    "example": "Tôi luyện phát âm bằng cách ghi âm để nghe lại lỗi của mình.",
    "wrong": "Tôi ghi âm bằng cách nghe lại lỗi. (ý ghi âm là phương tiện để nghe lại)",
    "repair": "Tôi ghi âm để nghe lại lỗi.",
    "reason": "Cần nêu đúng quan hệ mục tiêu: ghi âm nhằm tạo bản thu để nghe lại.",
    "exercise": "Nêu mục đích: Tôi ghi âm ___ nghe lại lỗi.",
    "answers": [
      "để"
    ],
    "explanation": "Nghe lại là mục tiêu của hành động ghi âm.",
    "lessons": [
      "vi-05"
    ]
  },
  {
    "id": "contrast",
    "title": "Tương phản và nhượng bộ",
    "forms": [
      "nhưng",
      "tuy nhiên",
      "tuy vậy",
      "mặc dù…nhưng…",
      "dù…vẫn…",
      "trái lại"
    ],
    "use": "Chỉ sự khác hướng, giới hạn hoặc kết quả trái mong đợi.",
    "contrast": "Nhưng nối trực tiếp các ý; tuy nhiên thuận tiện khi chuyển câu/đoạn. Mặc dù thường công nhận thực tế, dù có thể giả định. Trái lại cần có sự ngược hướng rõ.",
    "example": "Thời gian luyện tập còn ít. Tuy nhiên, nhóm đã tiến bộ rõ về phát âm.",
    "wrong": "Mặc dù trời mưa nên nhóm vẫn đến lớp. (ý nhượng bộ)",
    "repair": "Mặc dù trời mưa nhưng nhóm vẫn đến lớp.",
    "reason": "Mẫu nhượng bộ cần nhưng (hoặc bỏ từ ở vế sau), không dùng nên để nối kết quả trái dự đoán này.",
    "exercise": "Mặc dù trời mưa ___ nhóm vẫn đến lớp.",
    "answers": [
      "nhưng"
    ],
    "explanation": "Nhưng phù hợp với cặp mặc dù…nhưng… và quan hệ nhượng bộ.",
    "lessons": [
      "vi-02",
      "vi-07",
      "vi-10",
      "vi-11"
    ]
  },
  {
    "id": "condition",
    "title": "Điều kiện và ngoại lệ",
    "forms": [
      "nếu…thì…",
      "chỉ khi…mới…",
      "miễn là",
      "trừ khi"
    ],
    "use": "Đặt điều kiện, nhấn điều kiện cần hoặc chỉ trường hợp ngoại lệ.",
    "contrast": "Chỉ khi A mới B trình bày A như điều kiện cần. Miễn là nêu điều kiện chấp nhận; trừ khi nêu ngoại lệ. Không đổi các mẫu mà không kiểm tra lại ý nghĩa.",
    "example": "Bạn có thể mượn sách, miễn là trả đúng hạn. Chỉ khi có thẻ, bạn mới vào được phòng đọc.",
    "wrong": "Chỉ khi có thẻ, bạn thì vào được phòng đọc. (muốn nhấn điều kiện cần)",
    "repair": "Chỉ khi có thẻ, bạn mới vào được phòng đọc.",
    "reason": "Mới tương ứng với chỉ khi trong mẫu nhấn điều kiện cần.",
    "exercise": "Chỉ khi có thẻ, bạn ___ vào được phòng đọc.",
    "answers": [
      "mới"
    ],
    "explanation": "Chỉ khi…mới… nhấn điều kiện cần của việc được vào.",
    "lessons": [
      "vi-06",
      "vi-09"
    ]
  },
  {
    "id": "illustrate",
    "title": "Ví dụ, diễn giải và phương diện",
    "forms": [
      "cụ thể",
      "chẳng hạn",
      "ví dụ",
      "nói cách khác",
      "mặt khác"
    ],
    "use": "Triển khai khái quát, minh họa, diễn đạt lại hoặc mở phương diện khác.",
    "contrast": "Ví dụ/chẳng hạn dẫn trường hợp minh họa; nói cách khác trình bày lại ý; mặt khác đổi phương diện. Một ví dụ không đủ chứng minh một kết luận phổ quát.",
    "example": "Cần học chủ động. Chẳng hạn, hãy thử tự đặt một câu hỏi sau mỗi đoạn đọc.",
    "wrong": "Học nhóm giúp trao đổi. Nói cách khác, học nhóm còn tốn thời gian sắp lịch.",
    "repair": "Học nhóm giúp trao đổi. Mặt khác, nhóm cần thời gian sắp lịch.",
    "reason": "Vế sau mở phương diện tổ chức, không diễn đạt lại cùng một ý, nên dùng mặt khác.",
    "exercise": "Đổi sang phương diện khác: Mặt ___, nhóm cần thời gian sắp lịch.",
    "answers": [
      "khác"
    ],
    "explanation": "Mặt khác chuyển phương diện; nói cách khác là diễn giải lại.",
    "lessons": [
      "vi-11"
    ]
  },
  {
    "id": "summary",
    "title": "Tổng kết và mức độ khẳng định",
    "forms": [
      "tóm lại",
      "nhìn chung",
      "bởi vậy",
      "có thể thấy"
    ],
    "use": "Thu gọn ý, nêu đánh giá tổng thể hoặc suy luận phù hợp với căn cứ.",
    "contrast": "Tóm lại không mở luận điểm mới. Nhìn chung cho phép ngoại lệ. Bởi vậy chỉ phù hợp khi các ý trước thực sự hỗ trợ hệ quả hoặc suy luận.",
    "example": "Nhóm có ít thời gian và ngân sách hạn chế. Bởi vậy, nên thử ở quy mô nhỏ.",
    "wrong": "Nhóm có ba thành viên. Tóm lại, mọi lớp học đều nên học trực tuyến.",
    "repair": "Nhóm có ba thành viên. Thông tin này chưa đủ để kết luận về mọi lớp học.",
    "reason": "Từ nối không sửa được bước suy luận thiếu căn cứ hoặc phạm vi kết luận quá rộng.",
    "exercise": "Thu gọn các ý đã nêu: Tóm ___, cần thử ở quy mô nhỏ.",
    "answers": [
      "lại"
    ],
    "explanation": "Tóm lại báo rằng phần sau cô đọng lập luận đã có.",
    "lessons": [
      "vi-12"
    ]
  },
  {
    "id": "cohesion",
    "title": "Liên kết đoạn và dấu câu",
    "forms": [
      "từ khóa lặp lại",
      "điều này",
      "việc đó",
      "tuy nhiên,",
      "vì vậy,"
    ],
    "use": "Giữ rõ đối tượng đang nói; kết hợp từ nối với lặp từ khóa và phép thế có quy chiếu rõ.",
    "contrast": "Từ nối là cách gọi theo chức năng ở đây, không phải một từ loại duy nhất. Dấu phẩy sau yếu tố chuyển tiếp đầu câu thường giúp dễ đọc; không phải quy tắc đặt dấu phẩy sau mọi từ nối.",
    "example": "Lan luyện đọc mỗi ngày. Việc luyện đọc đều đặn giúp Lan tự tin hơn. Tuy nhiên, Lan vẫn cần sửa cách ngắt câu.",
    "wrong": "Lan giúp Mai sửa bài của Hương. Điều này rất khó. (chưa rõ điều này chỉ việc gì)",
    "repair": "Lan giúp Mai sửa bài của Hương. Việc sửa bài này khá khó vì có nhiều lỗi liên kết.",
    "reason": "Gọi lại đúng hoạt động thay vì để đại từ chỉ một thông tin không rõ. Không cần gắn một từ nối vào mọi câu.",
    "exercise": "Điền dấu chuyển tiếp theo quan hệ tương phản: Lan đọc trôi chảy. Tuy ___, cách ngắt câu chưa tự nhiên.",
    "answers": [
      "nhiên"
    ],
    "explanation": "Tuy nhiên mở ý hạn chế; dấu phẩy tách yếu tố chuyển tiếp ở đầu câu.",
    "lessons": [
      "vi-11",
      "vi-12"
    ]
  }
];

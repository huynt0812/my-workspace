# Focus Workspace

Không gian làm việc tập trung - giúp bạn tập trung vào công việc mà không bị xao nhãng.

## Tính năng (Phase 1 - MVP)

- **Hình nền tùy chỉnh**: Chọn từ bộ sưu tập có sẵn hoặc dán URL ảnh/video của riêng bạn
- **Đồng hồ thời gian thực**: Hiển thị giờ, ngày, lời chào theo thời điểm
- **Focus Timer (Pomodoro)**: Đồng hồ đếm ngược giúp tập trung, có chế độ nghỉ ngơi
- **Ghi chú nhanh**: Ghi lại ý tưởng, task trong quá trình làm việc

## Roadmap

| Phase | Tính năng | Trạng thái |
|-------|-----------|------------|
| 1 | Background + Clock + Timer + Notes | ✅ Hoàn thành |
| 2 | Google Login + Sync settings | 🔜 Sắp tới |
| 3 | YouTube Music Player | 🔜 Sắp tới |
| 4 | Telegram notifications | 🔜 Sắp tới |
| 5 | WhatsApp/Facebook notifications | 🔜 Sắp tới |

## Cài đặt & Chạy

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build
```

## Tech Stack

- React 19 + TypeScript
- Vite
- TailwindCSS v4
- localStorage (persistence)

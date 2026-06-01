document.addEventListener('DOMContentLoaded', function () {

  const calendarEl = document.getElementById('calendar');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',

    // 📥 讀取後端資料
    events: "http://localhost:3000/events",

    // ➕ 點日期新增
    dateClick: function(info) {
      const title = prompt("輸入行程");

      if (title) {
        fetch("http://localhost:3000/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            start: info.dateStr,
            end: info.dateStr
          })
        }).then(() => location.reload());
      }
    },

    // ❌ 點事件刪除
    eventClick: function(info) {
      if (confirm("要刪除這個行程嗎？")) {
        fetch("http://localhost:3000/events/" + info.event.id, {
          method: "DELETE"
        }).then(() => location.reload());
      }
    }

  });

  calendar.render();
});
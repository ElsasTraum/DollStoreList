var parameter = {
        url: 'https://docs.google.com/spreadsheets/d/1oR_7KguZ6YThuSx7qJZl5NGRJhuLcOrJAmJMM96O9X4/edit?usp=sharing',
        name: '工作表1',
        startRow: 1,
        startColumn: 1
    },
    appUrl = 'https://script.google.com/macros/s/AKfycbwwTSfAs1ndcXwB0_ZnQeLXB23zZCz_s8cHqyTQDpmmaA3iCPsemos_rlFYDRKREBpA/exec',
    sendBtn = document.getElementById('sendBtn'),
    show = document.getElementById('show');


sendBtn.onclick = function() { loadData() };

function loadData() {
    $.get(appUrl, parameter, function(data) {
        if (!data) {
            show.textContent = '無資料';
        } else {
            show.textContent = data;
        }
    });
}
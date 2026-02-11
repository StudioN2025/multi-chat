// Основные переменные
let currentMode = 'inoagent';
let currentValue = 0;
let intervalId = null;
let alertTimeout = null;

// DOM элементы
const modeSelect = document.getElementById('modeSelect');
const startBtn = document.getElementById('startBtn');
const readyBtn = document.getElementById('readyBtn');
const scaleContainer = document.getElementById('scaleContainer');
const levelBar = document.getElementById('radiationLevel');
const valueDisplay = document.getElementById('radiationValue');
const unitLabel = document.getElementById('unitLabel');
const alertBox = document.getElementById('alert');
const penisContainer = document.getElementById('penisContainer');
const penisInstruction = document.getElementById('penisInstruction');
const penisResult = document.getElementById('penisResult');
const scanAnimation = document.getElementById('scanAnimation');

// Инициализация
applyMode();

// Переключение режима
modeSelect.addEventListener('change', () => {
    currentMode = modeSelect.value;
    resetAll();

    if (['penis', 'penis_scanner', 'penis_in_jope'].includes(currentMode)) {
        // Показываем специальный интерфейс
        scaleContainer.style.display = 'none';
        startBtn.style.display = 'inline-block';
        readyBtn.style.display = 'none';
        penisContainer.style.display = 'block';
        unitLabel.style.display = 'none';
        valueDisplay.style.display = 'none';
        penisInstruction.textContent = '';
        penisResult.textContent = '';
        scanAnimation.style.display = 'none';
    } else {
        // Обычные режимы
        scaleContainer.style.display = 'block';
        startBtn.style.display = 'inline-block';
        readyBtn.style.display = 'none';
        penisContainer.style.display = 'none';
        unitLabel.style.display = 'block';
        valueDisplay.style.display = 'block';
        applyMode();
    }
});

// Применение настроек режима
function applyMode() {
    const selectedOption = modeSelect.options[modeSelect.selectedIndex];
    const modeText = selectedOption.textContent;
    const modeName = modeText.replace(/-метр$/, '');
    levelBar.style.background = modeColors[currentMode] || "linear-gradient(to top, #444, #888)";
    unitLabel.textContent = `усл. ед. ${modeName.toLowerCase()}`;
}

// Сброс всех значений
function resetAll() {
    currentValue = 0;
    levelBar.style.height = '0px';
    valueDisplay.textContent = '0';
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        startBtn.textContent = "Запустить Метр";
    }
}

// Обновление значения
function updateValue() {
    if (currentValue === 0) {
        currentValue = CONFIG.minValue;
    } else {
        let maxStep = currentValue <= 50 ? 20 : 12;
        const change = (Math.random() * maxStep * 2) - maxStep;
        currentValue += change;
        currentValue = Math.min(CONFIG.maxValue, Math.max(CONFIG.minValue, currentValue));
    }

    const height = ((currentValue - CONFIG.minValue) / (CONFIG.maxValue - CONFIG.minValue)) * 300;
    levelBar.style.height = `${height}px`;
    valueDisplay.textContent = Math.round(currentValue).toString();

    if (Math.round(currentValue) >= CONFIG.maxValue) {
        clearInterval(intervalId);
        intervalId = null;

        if (currentMode === 'radiation') {
            showAlert("❗☢️☢️☢️❗");
        } else {
            const selectedOption = modeSelect.options[modeSelect.selectedIndex];
            const modeText = selectedOption.textContent;
            const modeName = modeText.replace(/-метр$/, '');
            showAlert(`Вы ${modeName}!`);
        }

        smoothStop();
    }
}

// Плавная остановка
function smoothStop() {
    const smoothInterval = setInterval(() => {
        if (currentValue <= 0) {
            clearInterval(smoothInterval);
            resetAll();
            startBtn.textContent = "Запустить Метр";
        } else {
            currentValue = Math.max(0, currentValue - 5);
            const height = ((currentValue - CONFIG.minValue) / (CONFIG.maxValue - CONFIG.minValue)) * 300;
            levelBar.style.height = `${height}px`;
            valueDisplay.textContent = Math.round(currentValue).toString();
        }
    }, 50);
}

// Показать уведомление
function showAlert(message) {
    if (alertTimeout) clearTimeout(alertTimeout);
    alertBox.textContent = message;
    alertBox.classList.add('show');
    alertTimeout = setTimeout(() => {
        alertBox.classList.remove('show');
    }, 2000);
}

// Генерация размера для спецрежима
function generatePenisSize() {
    if (Math.random() < 0.9) {
        const cm = (Math.random() * 19 + 1).toFixed(2);
        return `${cm} см`;
    } else {
        const absurdValues = [
            `${(Math.random() * 999).toFixed(2)} мкм`,
            `${(Math.random() * 100 + 20).toFixed(2)} см`,
            `${(Math.random() * 50).toFixed(2)} дм`,
            `${(Math.random() * 3).toFixed(2)} км`,
            `∞`,
            `-5 см (внутрь)`,
            `размера нет, только боль`,
            `только в воображении`,
            `скрытый параметр`,
            `не определён (404)`,
            `слишком большой для этого мира`,
            `меньше пикселя`
        ];
        return absurdValues[Math.floor(Math.random() * absurdValues.length)];
    }
}

// Обработчики кнопок
startBtn.addEventListener('click', () => {
    if (['penis', 'penis_scanner', 'penis_in_jope'].includes(currentMode)) {
        penisInstruction.textContent = 'Просьба навести камеру на свой хуй';
        startBtn.style.display = 'none';
        readyBtn.style.display = 'inline-block';
    } else {
        if (intervalId) {
            smoothStop();
            startBtn.textContent = "Запустить Метр";
        } else {
            intervalId = setInterval(updateValue, 300);
            startBtn.textContent = "Остановить Метр";
        }
    }
});

readyBtn.addEventListener('click', () => {
    startBtn.style.display = 'none';
    readyBtn.style.display = 'none';
    scanAnimation.style.display = 'block';
    penisInstruction.textContent = 'Смотрим...';

    setTimeout(() => {
        penisInstruction.textContent = 'Отправляем...';
    }, 1000);

    setTimeout(() => {
        penisInstruction.textContent = 'Обрабатываем...';
    }, 2000);

    setTimeout(() => {
        penisInstruction.textContent = 'Рассчитываем...';
    }, 2000 + 6000 + Math.random() * 1000);

    setTimeout(() => {
        penisInstruction.textContent = 'Получаем...';
    }, 2000 + 7000 + Math.random() * 1000);

    setTimeout(() => {
        const size = generatePenisSize();
        penisResult.textContent = size;
        penisInstruction.textContent = 'Ваш размер хуя:';
        scanAnimation.style.display = 'none';
    }, 2000 + 7000 + 2000);
});

"use strict";

const MAX_MEMBER = 10;
const MIN_MEMBER = 2;
const MAX_NAME_LENGTH = 9;

var app;
window.onload = () => {
    app = new App();
    app.resize();
    updateMemberButtons();
    renumberActivities();
    syncNameOptions();
};

const font = "Gowun Dodum";
var nameBoxSize = 50;
var nameBoxNumber = 3;

$(document).on("keyup", ".member-name", function () {
    if (this.value.length >= MAX_NAME_LENGTH) {
        this.setCustomValidity(
            `이름은 최대 ${MAX_NAME_LENGTH}자까지만 입력할 수 있습니다.`
        );
    } else this.setCustomValidity("");
});
$(document).on("input change", ".member-name", function () {
    syncNameOptions();
});
$(document).on(
    "input change",
    ".activity-money, .activity-spender, .activity-member-input",
    function () {
        getResult();
    }
);
$(document).on(
    "input change",
    ".additional-field input, .additional-field .additional-select",
    function () {
        getResult();
    }
);
$(document).on("change", "input.cut-input", function () {
    getResult();
});

function getMemberCount() {
    return $(".member-field").length;
}

function renumberMembers() {
    $(".member-field").each((index, item) => {
        const memberIndex = index + 1;
        const id = `member-name-${memberIndex}`;
        $(item).find(".member-label").attr("for", id).text(`참가자${memberIndex}:`);
        $(item).find(".member-name").attr("id", id);
    });
}

function createMemberField(memberIndex) {
    const field = document.createElement("div");
    const label = document.createElement("label");
    const input = document.createElement("input");

    field.className = "member-field";
    label.className = "member-label";
    input.className = "member-name";
    input.type = "text";
    input.maxLength = 10;
    input.placeholder = "이름";
    input.value = "";

    const id = `member-name-${memberIndex}`;
    label.setAttribute("for", id);
    label.innerText = `참가자${memberIndex}:`;
    input.id = id;

    field.append(label);
    field.append(input);
    return field;
}

function updateMemberButtons() {
    var number = getMemberCount();
    $("#add-button").prop("disabled", number >= MAX_MEMBER);
    $("#remove-button").prop("disabled", number <= MIN_MEMBER);
}

function getMemberNamesRaw() {
    const names = [];
    $(".member-name").each((index, item) => {
        const name = String($(item).val()).trim();
        if (name !== "") names.push(name);
    });
    return names;
}

function getMemberNames() {
    return [...new Set(getMemberNamesRaw())];
}

function updateActivitySpenderNames() {
    const memberNames = getMemberNames();
    $(".activity-spender").each((_, item) => {
        const selected = $(item).val();
        item.innerHTML = "";
        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.innerText = "이름 선택";
        item.append(placeholder);

        memberNames.forEach((name) => {
            const option = document.createElement("option");
            option.value = name;
            option.innerText = name;
            item.append(option);
        });

        $(item).val(selected);
        if ($(item).val() === null) {
            $(item).val(memberNames.length > 0 ? memberNames[0] : "");
        }
    });
}

function renderActivityMembers() {
    const memberNames = getMemberNames();
    $(".activity-members").each((blockIndex, container) => {
        const checkedMap = {};
        $(container)
            .find(".activity-member-input")
            .each((_, item) => {
                checkedMap[item.value] = item.checked;
            });

        container.innerHTML = "";
        memberNames.forEach((name, nameIndex) => {
            const id = `activity-${blockIndex + 1}-member-${nameIndex + 1}`;
            const checked =
                checkedMap[name] === undefined ? true : checkedMap[name];
            const element = `
                <div class="activity-member-item">
                    <input class="activity-member-input" type="checkbox" id="${id}" value="${name}" ${
                checked ? "checked" : ""
            } />
                    <label class="activity-member-label" for="${id}">${name}</label>
                </div>
            `;
            container.insertAdjacentHTML("beforeend", element);
        });
    });
}

function renumberActivities() {
    const activityCount = $(".activity-block").length;
    $(".activity-block").each((index, block) => {
        const item = $(block).find(".activity-title");
        $(item).text(`활동 ${index + 1}`);
        $(block).find(".activity-remove-btn").toggle(activityCount > 1);
    });
}

function createActivityBlock() {
    const wrapper = document.createElement("div");
    wrapper.className = "activity-block";
    wrapper.innerHTML = `
        <div class="activity-title-row">
            <h2 class="center-text activity-title">활동</h2>
            <button type="button" class="activity-remove-btn">x</button>
        </div>
        <div class="activity-header">
            <span class="activity-header-label">지출자:</span>
            <select class="input activity-input activity-spender" required>
                <option value="">이름 선택</option>
            </select>
            <input
                type="number"
                class="input activity-input activity-money"
                placeholder="금액"
                value=""
            />
            <span class="activity-header-suffix">원 사용</span>
        </div>
        <div class="activity-member-title">참여자 명단</div>
        <div class="activity-members"></div>
        <button type="button" class="activity-add-btn">활동 추가</button>
    `;
    return wrapper;
}

function syncNameOptions() {
    updateActivitySpenderNames();
    renderActivityMembers();
    updateAdditionalNames();
    getResult();
}

$(document).on("click", ".activity-add-btn", function () {
    const currentBlock = $(this).closest(".activity-block");
    const newBlock = createActivityBlock();
    newBlock.classList.add("is-collapsed");
    currentBlock.after(newBlock);
    requestAnimationFrame(() => {
        newBlock.classList.remove("is-collapsed");
    });
    renumberActivities();
    syncNameOptions();
});

$(document).on("click", ".activity-remove-btn", function () {
    const currentBlock = $(this).closest(".activity-block");
    if ($(".activity-block").length <= 1) {
        return;
    }
    if (currentBlock.hasClass("is-collapsed")) return;

    currentBlock.addClass("is-collapsed");
    window.setTimeout(() => {
        currentBlock.remove();
        renumberActivities();
        syncNameOptions();
    }, 240);
});
$("#additional").click(function () {
    var field = document.createElement("div");
    var slt1 = document.createElement("select");
    var slt2 = document.createElement("select");
    var input = document.createElement("input");
    var span1 = document.createElement("span");
    var span2 = document.createElement("span");
    var span3 = document.createElement("span");
    var removeBtn = document.createElement("button");
    field.className = "additional-field is-collapsed";
    slt1.className = "additional-select select-from";
    slt2.className = "additional-select select-to";
    input.type = "number";
    removeBtn.type = "button";
    removeBtn.className = "additional-remove-btn";
    removeBtn.innerText = "x";
    span1.innerText = "가 ";
    span2.innerText = "에게 ";
    span3.innerText = "원 갚아야 함";
    field.append(slt1);
    field.append(span1);
    field.append(slt2);
    field.append(span2);
    field.append(input);
    field.append(span3);
    field.append(removeBtn);

    $(".additional-container").append(field);

    updateAdditionalNames();
    requestAnimationFrame(() => {
        field.classList.remove("is-collapsed");
    });
});

$(document).on("click", ".additional-remove-btn", function () {
    const currentField = $(this).closest(".additional-field");
    if (currentField.hasClass("is-collapsed")) return;

    currentField.addClass("is-collapsed");
    window.setTimeout(() => {
        currentField.remove();
        getResult();
    }, 220);
});

function updateAdditionalNames() {
    $(".additional-select").each(function (index, item) {
        var idx = item.selectedIndex;
        var arrName = getMemberNames();
        item.innerHTML = "";
        arrName.forEach((v, i) => {
            var option = document.createElement("option");
            option.innerText = `${v}`;
            item.append(option);
        });
        item.selectedIndex = idx < 0 ? 0 : idx;
    });
}

function clearResult() {
    $("#sum").html("0");
    $("#result").empty();
    if (app) {
        app.moneyLines = [];
        app.nameBoxes = [];
    }
}

// Dutch pay
function getResult() {
    clearResult();

    // Member name is empty one or more, stop
    var isMemberNameEmpty = false;
    $(".member-name").each(function (index, item) {
        if ($(item).val().trim() === "") {
            isMemberNameEmpty = true;
            this.setCustomValidity("이름을 입력해주세요.");
        } else {
            this.setCustomValidity("");
        }
    });
    if (isMemberNameEmpty) {
        return;
    }

    const memberNamesRaw = getMemberNamesRaw();
    const memberNames = getMemberNames();
    if (memberNamesRaw.length !== memberNames.length) {
        const memberNameCounts = {};
        $(".member-name").each(function () {
            const name = $(this).val().trim();
            if (name === "") return;
            memberNameCounts[name] = (memberNameCounts[name] || 0) + 1;
        });

        $(".member-name").each(function () {
            const name = $(this).val().trim();
            if (name !== "" && memberNameCounts[name] > 1) {
                this.setCustomValidity("이름이 중복됩니다.");
            } else {
                this.setCustomValidity("");
            }
        });
        return;
    }

    const arrName = memberNames;
    const arrMoney = new Array(arrName.length).fill(0);
    const activities = [];

    $(".activity-block").each((_, block) => {
        const activitySpenderInput = $(block).find(".activity-spender")[0];
        const activityMoneyInput = $(block).find(".activity-money")[0];
        const spender = String($(activitySpenderInput).val() || "");
        const money = Number($(activityMoneyInput).val() || 0);
        activitySpenderInput.setCustomValidity("");
        activityMoneyInput.setCustomValidity("");

        const selectedMembers = [];
        $(block)
            .find(".activity-member-input:checked")
            .each((__, item) => {
                selectedMembers.push(String(item.value));
            });

        // 1) 지출자/금액/참여자가 유효하지 않으면 해당 활동은 계산에서 제외
        if (spender === "" || !(money > 0) || selectedMembers.length === 0) {
            return;
        }

        const users = selectedMembers.filter((name) => name !== spender);
        // 참여자가 지출자 본인만인 활동은 정산 영향이 없으므로 제외
        if (users.length === 0) return;

        activities.push({
            spender,
            money,
            users,
            participantCount: selectedMembers.length,
        });
        const spenderIndex = arrName.indexOf(spender);
        if (spenderIndex !== -1) {
            arrMoney[spenderIndex] += money;
        }
    });

    const sum = activities.reduce((acc, activity) => acc + activity.money, 0);

    $("#sum").html(String(sum));
    $("#result").empty();

    var moneyData = calMoney(arrName, arrMoney, activities);
    drawResult(arrName, moneyData);
}

function drawResult(arrName, moneyData) {
    nameBoxNumber = moneyData.n;
    app.resize();

    // set colors and coordinates
    app.colors = [];
    app.coords = [];
    for (let i = 0; i < moneyData.n; i++) {
        let colorH = (i / moneyData.n) * 255 + 25;
        app.colors.push(`hsl(${colorH}, 80%, 40%)`);

        let x = Math.cos(((-i / moneyData.n) * 2 - 0.5) * Math.PI);
        let y = Math.sin(((-i / moneyData.n) * 2 - 0.5) * Math.PI);

        app.coords.push({ x, y });
    }

    // create elements
    app.nameBoxes = [];
    app.moneyLines = [];
    for (let i = 0; i < moneyData.n; i++) {
        let name = String(arrName[i]);

        // create nameBoxes
        let { x, y } = app.coords[i];
        app.nameBoxes.push(
            new NameBox(x, y, nameBoxSize, name, app.colors[i], app, i)
        );
    }

    // create moenylines
    moneyData.getMessageToSend().forEach((value) => {
        let index1 = arrName.indexOf(value[0]);
        let index2 = arrName.indexOf(value[1]);

        if (index1 != -1 && index2 != -1) {
            app.moneyLines.push(
                new moneyLine(
                    app.coords[index1]["x"],
                    app.coords[index1]["y"],
                    app.coords[index2]["x"],
                    app.coords[index2]["y"],
                    value[2],
                    app,
                    index1,
                    index2
                )
            );
        }
    });

}

function addMember() {
    var number = getMemberCount();

    if (number < MAX_MEMBER) {
        const newField = createMemberField(number + 1);
        newField.classList.add("is-collapsed");
        $(".member-container").append(newField);
        requestAnimationFrame(() => {
            newField.classList.remove("is-collapsed");
        });
    }
    updateMemberButtons();
    syncNameOptions();
}

function removeMember() {
    var number = getMemberCount();

    if (number > MIN_MEMBER) {
        const lastField = $(".member-field:last");
        if (lastField.hasClass("is-collapsed")) return;

        lastField.addClass("is-collapsed");
        window.setTimeout(() => {
            lastField.remove();
            renumberMembers();
            updateMemberButtons();
            syncNameOptions();
        }, 220);
        return;
    }
    updateMemberButtons();
    syncNameOptions();
}

function calMoney(arrName, arrMoney, activities) {
    var cutUnit = Number($("input.cut-input:checked").val());
    let moneyData = new MoneyData(arrName, arrMoney)?.start();

    activities.forEach((activity) => {
        // 분모는 "송금자 수"가 아니라 "활동 참여자 수(지출자 포함 가능)".
        const splitMoney = activity.money / activity.participantCount;
        activity.users.forEach((user) => {
            // 참여자(user)가 지출자(spender)에게 내야 하므로 from/to를 뒤집어 반영한다.
            moneyData = moneyData.addAdditionalPay(
                user,
                activity.spender,
                splitMoney
            );
        });
    });

    $(".additional-field").each((i, v) => {
        var name_spender = v.childNodes[0].value;
        var name_user = v.childNodes[2].value;
        var moneyRaw = String(v.childNodes[4].value ?? "").trim();
        var money = Number(moneyRaw);
        // 3) 송금자/수금자 동일 또는 금액 미입력은 무시
        if (name_spender === name_user) return;
        if (moneyRaw === "") return;
        if (money > 0) {
            moneyData = moneyData.addAdditionalPay(name_spender, name_user, money);
        }
    });

    moneyData = moneyData.step2().step3();

    moneyData = moneyData.cutMoney(cutUnit).calculateLoss();

    // indicate the result.
    {
        let div = "<div>인당 지출 금액: " + String(moneyData.average);
        $("#result").append(div);
    }

    moneyData.getMessageToCut().forEach((value) => {
        let msg = value.slice();
        msg.splice(1, 0, msg[1] > 0 ? "손해" : "이득");
        msg[2] = Math.abs(msg[2]);
        $("#result").append("<div>절삭으로 인한 %s님의 %s: %s".format(msg));
    });

    return moneyData;
}

// Scroll
function scrollSmooth(isDown) {
    window.scrollTo({
        behavior: "smooth",
        left: 0,
        top: isDown ? document.body.scrollHeight : 0,
    });
}

function scrollSmoothToCanvas() {
    window.scrollTo({
        behavior: "smooth",
        left: 0,
        top: $("#result-canvas").offset().top,
    });
}

// Draw
class App {
    constructor() {
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");

        // window.addEventListener('resize', this.resize.bind(this), false);
        window.requestAnimationFrame(this.animate.bind(this));

        this.nameBoxes = [];
        this.moneyLines = [];
        this.colors = [];
        this.coords = [];
        this.preWindowWidth = 0;
        this.preWindowHeight = 0;

        this.canvasSize = 0.9;
    }

    resize() {
        this.stageWidth = $(window).width() * this.canvasSize;
        this.stageHeight = $(window).height();

        this.canvas.width = this.stageWidth;
        this.canvas.height = this.stageHeight;

        this.ctx.scale(1, 1);

        // set elements's center
        this.moneyLines.forEach((moneyLine) => {
            moneyLine.resize(this);
        });

        this.nameBoxes.forEach((nameBox) => {
            nameBox.resize(this);
        });

        nameBoxSize =
            40 + (this.stageWidth - 200) / 60 - (nameBoxNumber - 3) * 3;
    }

    animate(t) {
        if (
            this.preWindowWidth != $(window).width() * this.canvasSize ||
            this.preWindowHeight != $(window).height()
        ) {
            this.preWindowWidth = $(window).width() * this.canvasSize;
            this.preWindowHeight = $(window).height();
            this.resize();
        }

        window.requestAnimationFrame(this.animate.bind(this));

        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

        // draw elements
        this.moneyLines.forEach((moneyLine) => {
            moneyLine.drawLine(this.ctx);
        });

        this.nameBoxes.forEach((nameBox) => {
            nameBox.draw(this.ctx);
        });

        this.moneyLines.forEach((moneyLine) => {
            moneyLine.drawMoney(this.ctx);
        });
    }
}

class moneyLine {
    constructor(x1, y1, x2, y2, money, app, index1, index2) {
        // apply param of constructor
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.money = money;
        this.app = app;
        this.index1 = index1; // for setting colors
        this.index2 = index2;

        // line
        this.x2line = 0;
        this.y2line = 0;

        // arrow
        this.x2arrow = 0;
        this.y2arrow = 0;
        this.angle = 0;
        this.size = 0;
        this.height = 0;

        this.distance = 150;
        this.cx = 0;
        this.cy = 0;
        this.resize(app);

        this.color1 = "#ffffff";
        this.color2 = "#000000";
        this.setColor(app);

        this.dashOffset = 0;
    }

    drawLine(ctx) {
        var x1 = this.x1 + this.cx;
        var y1 = this.y1 + this.cy;
        var x2 = this.x2 + this.cx;
        var y2 = this.y2 + this.cy;
        var mx = (x1 + x2) * 0.5;
        var my = (y1 + y2) * 0.5;

        // draw line
        var gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, this.color1);
        gradient.addColorStop(1, this.color2);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.size * 0.2;
        ctx.setLineDash([15, 5]);
        ctx.lineDashOffset = this.dashOffset;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(this.x2line + this.cx, this.y2line + this.cy);
        ctx.stroke();

        this.dashOffset -= 0.25;

        // draw arrow
        ctx.fillStyle = this.color2;
        ctx.translate(this.x2arrow + this.cx, this.y2arrow + this.cy);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.moveTo(-this.size, -this.height);
        ctx.lineTo(0, 0);
        ctx.lineTo(-this.size, this.height);
        ctx.closePath();
        ctx.fill();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    drawMoney(ctx) {
        var mx = this.x1 * 0.3 + this.x2 * 0.7 + this.cx;
        var my = this.y1 * 0.3 + this.y2 * 0.7 + this.cy;

        // draw money background
        ctx.font = `bold ${nameBoxSize * 0.5}px Gowun Dodum`;
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "#ffffff";
        ctx.setLineDash([]);
        ctx.textAlign = "center";
        ctx.lineWidth = nameBoxSize * 0.1;
        ctx.strokeText(this.money, mx, my + 1);

        // draw money
        ctx.font = `bold ${nameBoxSize * 0.5}px Gowun Dodum`;
        ctx.fillStyle = "#222222";
        ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText(this.money, mx, my + 1);
        initShadow(ctx);
    }

    resize(app) {
        this.distance = getDistance(app);

        this.x1 = app.coords[this.index1]["x"] * this.distance;
        this.y1 = app.coords[this.index1]["y"] * this.distance;
        this.x2 = app.coords[this.index2]["x"] * this.distance;
        this.y2 = app.coords[this.index2]["y"] * this.distance;

        this.angle =
            -Math.atan2(this.x2 - this.x1, this.y2 - this.y1) + Math.PI * 0.5;
        this.size = Math.min(this.distance * 0.1 * (nameBoxSize / 30), 32);
        this.height = this.size * 0.5;

        // re-calculate coordinate of index-2 (considering with nameBoxSize)
        let length = Math.sqrt(
            Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2)
        );
        let ratio = 1 - nameBoxSize / length;
        this.x2arrow = lerp(this.x1, this.x2, ratio);
        this.y2arrow = lerp(this.y1, this.y2, ratio);
        ratio = 1 - (nameBoxSize + this.size) / length;
        this.x2line = lerp(this.x1, this.x2, ratio);
        this.y2line = lerp(this.y1, this.y2, ratio);

        this.cx = app.canvas.width / 2;
        this.cy = app.canvas.height / 2;
    }

    setColor(app) {
        this.color1 = this.app.colors[this.index1];
        this.color2 = this.app.colors[this.index2];
    }
}

class NameBox {
    constructor(x, y, radius, name, color, app, index) {
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.name = name;
        this.color = color;
        this.index = index;

        this.distance = 150;
        this.cx = 0;
        this.cy = 0;
        this.resize(app);
    }

    draw(ctx) {
        var x = this.getX();
        var y = this.getY();

        // draw circle
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
        ctx.fill();

        // draw name
        var len = this.name.length;
        var col = len == 4 ? 2 : 3;
        var raw = Math.floor((len + 2) / 3);
        var lines = splitText(this.name, col);
        var size = (nameBoxSize * 1.5) / lines[0].length;
        var sizeY = size * (raw - 1);
        for (var i = 0; i < lines.length; i++) {
            ctx.font = `${size}px Gowun Dodum`;
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "center";

            var oy = i * size;
            oy -= sizeY / 2;
            ctx.fillText(lines[i], x, y + oy);
        }
    }

    resize(app) {
        this.distance = getDistance(app);

        this.x = app.coords[this.index]["x"] * this.distance;
        this.y = app.coords[this.index]["y"] * this.distance;

        this.cx = app.canvas.width / 2;
        this.cy = app.canvas.height / 2;

        this.radius = nameBoxSize;
    }

    getX() {
        return this.x + this.cx;
    }

    getY() {
        return this.y + this.cy;
    }
}

function getDistance(app) {
    return Math.min(100 + app.stageWidth * 0.2, app.stageHeight * 0.4);
}

// Utilities
function create2DArray(rows, columns) {
    var arr = new Array(rows);
    for (var i = 0; i < rows; i++) {
        arr[i] = new Array(columns);
    }
    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < columns; col++) {
            arr[col][row] = 0;
        }
    }
    return arr;
}

function ToFixedNumber(number) {
    return Number(number.toFixed(3));
}

String.prototype.format = function () {
    var formatted = this,
        i = 0;
    var newArguments = [];
    for (let i = 0; i < arguments.length; i++) {
        let arg = arguments[i];
        if (Array.isArray(arg)) newArguments.push(...arg);
        else newArguments.push(arg);
    }

    while (/%s/.test(formatted))
        formatted = formatted.replace("%s", newArguments[i++]);
    return formatted;
};

function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}

function initShadow(ctx) {
    ctx.shadowColor = "white";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}

function splitText(str, len) {
    let lines = [];
    for (let i = 0; i < str.length; i += len) {
        lines.push(str.substr(i, len));
    }
    return lines;
}

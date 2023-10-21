module.exports.clearAllCookies = (req, res, option = {}) => {
  Object.keys(req.cookies).forEach((cookieKey) => {
    console.log(cookieKey);
    res.clearCookie(cookieKey, option);
  });
  console.log("All cookies cleared!");
};

module.exports.timerUI = ({
  time = 10 * 1e3,
  afterMessage = "Timer completed",
  afterRunCode = "",
}) => {
  const uid = Math.random().toString(36).slice(2);
  const containerNodeId = `container-${uid}`;
  const nodeId = `timer-${uid}`;
  const nodeId2 = `after-display-${uid}`;

  return `
    <div id="${containerNodeId}">
        <label for="timer">Timer</label>
        <progress id="${nodeId}" max="100" value="0"></progress>
        <div id="${nodeId2}" hidden style="color: red; font-size: 48px; font-style: italic;">${afterMessage}</div>
        <script defer>
            const timerNode = document.querySelector("#${nodeId}");
            const timerDisplayNode = document.querySelector("#${nodeId2}");

            let done = false;
            const interval = setInterval(() => {


                timerNode.value += ${100 / (time / 1e3)};
                console.log("Timer now", timerNode.value);

                if (timerNode.value >= 100) {
                    done = true;
                }

                if (done) {
                    clearInterval(interval);
                    console.log("Timer completed");
                    timerDisplayNode.removeAttribute('hidden');
                    ${afterRunCode};
                    return;
                }
            }, 1000);
        </script>
    </div>
    `;
};

module.exports.subRequestContent = ({ src = "", callThirdParty = false }) => {
  return `
      <div style="border: 1px solid orange; display: inline-block;">
        <h2>Subrequest causing content</h2>
        <h2>3rd party url ? ${callThirdParty ? "yes" : "no"}</h2>
        <h3>${src}</h3>
        <img height="100px" src="${src}"/>
      </div>
    `;
};

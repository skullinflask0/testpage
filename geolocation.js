// ボタンを押した時の処理
document.getElementById("tntn").onclick = function(){
    // 位置情報を取得する
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
};

// 取得に成功した場合の処理
function successCallback(position){
    var latitude = position.coords.latitude;
    document.getElementById("latitude").innerHTML = latitude;

    var longitude = position.coords.longitude;
    document.getElementById("longitude").innerHTML = longitude;
    
};



// 取得に失敗した場合の処理
function errorCallback(error){
    alert("位置情報が取得できませんでした");
};

// Hotpepper APIのキーを読み込む
fetch('HotPepperApiSetting.json')
    .then(response => response.json())
    .then(data => {
        const apiKey = data.apiKey;

        // ボタンを押した時の処理
        document.getElementById("tntn").onclick = function () {
            // 位置情報を取得する
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    // 緯度と経度を取得
                    var latitude = position.coords.latitude;
                    var longitude = position.coords.longitude;

                    // Hotpepper APIを呼び出す
                    getRestaurants(apiKey, latitude, longitude);
                },
                function (error) {
                    alert("位置情報が取得できませんでした");
                }
            );
        };
    });

// Hotpepper APIからレストランデータを取得する関数
function getRestaurants(apiKey, latitude, longitude) {
    // Hotpepper APIのエンドポイント
    const apiUrl = 'https://webservice.recruit.co.jp/hotpepper/gourmet/v1/';

    // 半径（メートル）を取得
    const radius = document.getElementById("amountDropdown").value;

    // Hotpepper APIにリクエストを送信
    fetch(`${apiUrl}?key=${apiKey}&lat=${latitude}&lng=${longitude}&range=${radius}&format=json`)
        .then(response => response.json())
        .then(data => {
            // レストランデータをもとにBootstrapのカードを生成して表示
            displayRestaurants(data.results.shop);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// レストランデータをもとにBootstrapのカードを生成して表示する関数
function displayRestaurants(restaurants) {
    const restaurantContainer = document.getElementById('restaurantContainer');
    restaurantContainer.innerHTML = ''; // カードをリセット

    restaurants.forEach(restaurant => {
        // カードのHTMLを生成
        const cardHtml = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${restaurant.name}</h5>
                    <p class="card-text">${restaurant.address}</p>
                    <a href="${restaurant.urls.pc}" class="btn btn-primary">詳細を見る</a>
                </div>
            </div>
        `;

        // カードをコンテナに追加
        restaurantContainer.innerHTML += cardHtml;
    });
}

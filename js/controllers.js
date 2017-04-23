app.controller('mainCtrl', ['$scope', function ($scope) {
    if (window.location.hash) {
        $scope.song = window.location.hash.substring(1);
    } else {
        $scope.song = "";
    }

    $scope.buttonName = 1;
    $scope.isMobile = window.mobilecheck();

    if ($scope.isMobile) {
        $scope.error = "Please open this page in a desktop browser.";
        $scope.song = "";
    }

    $scope.playSong = function () {
        console.log($scope.song);
        if ($scope.buttonName == 1) {
            peppePlay(parsePeppeNotation($scope.song, $scope), $scope);
            $scope.buttonName = 0;
        } else {
            Tone.Transport.stop();
            Tone.Transport.cancel();
            $scope.buttonName = 1;
        }
    };
}]);

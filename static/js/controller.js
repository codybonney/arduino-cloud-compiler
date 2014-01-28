function Controller($scope) {
	$scope.status = "ready";
	$scope.sketch = "#define LED_PIN 13\n\nvoid setup()\n{\n    pinMode(LED_PIN, OUTPUT);\n}\n\nvoid loop()\n{\n    digitalWrite(LED_PIN, HIGH);\n    delay(100);\n    digitalWrite(LED_PIN, HIGH);\n    delay(900);\n}";
	$scope.compiling = false;
	$scope.compileTime = $scope.compiled = "";

	$scope.compile = function() {
		$scope.compiling = true;
		var compileTimeStart = new Date().getTime();

		$.ajax({
			type: "POST",
			url: "./compile",
			data: {
				sketch: $scope.sketch
			}
		})
		.success(function(hex) {
			$scope.compiling = false;
			var compileTimeEnd = new Date().getTime();
			$scope.compileTime = 'Processed sketch in ' + (compileTimeEnd - compileTimeStart) + 'ms';

			if(hex.error) {
				$scope.compiled = hex.error;
				$scope.status = "error";
			} else {
				$scope.compiled = hex.data;
				$scope.status = "success"
			}

			$scope.$apply();
		})

		.error(function(res) {
			$scope.compiling = false;
			$scope.compiled = "Error communicating with server\n response: " + res;
			$scope.$apply();
		});
	};

	$scope.$watch('compiling', function() {
		if($scope.compiling) {
			$scope.submitButton = $scope.compiled = "Compiling...";
			$scope.status = "compiling";
		} else {
			$scope.submitButton = "Compile Sketch";
		}
	});
}
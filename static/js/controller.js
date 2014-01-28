function Controller($scope) {
	$scope.status = "ready";
	$scope.sketch = "#define LED_PIN 13\n\nvoid setup()\n{\n    pinMode(LED_PIN, OUTPUT);\n}\n\nvoid loop()\n{\n    digitalWrite(LED_PIN, HIGH);\n    delay(100);\n    digitalWrite(LED_PIN, HIGH);\n    delay(900);\n}";
	$scope.compiling = false;
	$scope.compileTime = $scope.compiled = "";

	$scope.compile = function() {
		$scope.compiling = true;

		$.ajax({
			type: "POST",
			url: "./compile",
			data: {
				sketch: $scope.sketch
			}
		})
		.success(function(res) {
			$scope.compiling = false;
			console.log(res);

			if(res.processing_time_ms) {
				$scope.compileTime = 'Processed sketch in ' + res.processing_time_ms + 'ms';
			}

			if(res.firmware_size_bytes) {
				$scope.firmware_size = '(' + res.firmware_size_bytes + ' bytes)';
			}

			if(res.error) {
				$scope.compiled = res.error;
				$scope.status = "error";
			}
			else if(res.firmware) {
				$scope.compiled = res.firmware;
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
			$scope.firmware_size = '';
		} else {
			$scope.submitButton = "Compile Sketch";
		}
	});
}
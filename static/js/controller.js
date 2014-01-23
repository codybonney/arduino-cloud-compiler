function Controller($scope) {
	var $submitButton = $("#submit");
	var $compileTime = $("#compileTime");
	var $sketch = $("#sketch");
	var $compiled = $("#compiled");

	$scope.master = {};
	$scope.sketch = "#define LED_PIN 13\n\nvoid setup()\n{\n    pinMode(LED_PIN, OUTPUT);\n}\n\nvoid loop()\n{\n    digitalWrite(LED_PIN, HIGH);\n    delay(100);\n    digitalWrite(LED_PIN, HIGH);\n    delay(900);\n}";
	$scope.submit_sketch = "TEST";

	$scope.compile = function() {
		$compileTime.html('Compiling...');
		$compiled.val("");
		$submitButton.val("Compiling Sketch...").addClass('compiling');

		var compileTimeStart = new Date().getTime();

		$.ajax({
			type: "POST",
			url: "./compile",
			data: {
			sketch: $sketch.val()
			}
			})
			.done(function(hex) {
			var compileTimeEnd = new Date().getTime();
			$compiled.val(hex);
			$compileTime.html('Compiled sketch in ' + (compileTimeEnd - compileTimeStart) + 'ms');
			$submitButton.val("Compile Sketch").removeClass('compiling');
		});
	};

}
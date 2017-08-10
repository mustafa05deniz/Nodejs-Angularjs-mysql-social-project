var scotchTodo = angular.module('scotchTodo', []);


function mainController($scope, $http){
	
	$scope.formData = {};

	// Hiç bir şeye basılmadığında yani direk site açılğında router.js içerisine direk get methoduna gidiyor . 
	$http.get('/api/todos')
		.success(function(data) {
			$scope.gonderi = data;
			console.log($scope.gonderi.length,'veri geldi')
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});



	



	$scope.createTodo = function() { 
		$http.post('/api/todos', $scope.formData)
			.success(function(data) {
				$scope.formData = {}; // clear the form so our user is ready to enter another
				$scope.gonderi = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	
	$http.get('/api/user')
		.success(function(data){
			$scope.kullanici = data
			console.log(data)
			})
		.error(function(data){
			
			});
		

	
	
	
	
	$scope.addcomment = function(id) { 
		console.log("id"+id);
		$http.post('/api/comments/' + id, $scope.formData)
			.success(function(data) {
				$scope.formData = {}; // clear the form so our user is ready to enter another
				$scope.comment = data;
				
				console.log(data,'kadar');
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	
	

	
	$scope.viewcomment=function(id){
		console.log("id"+id);
		$http.get('/api/viewcomments/'+ id, $scope.formData)
			.success(function(data) {
				$scope.formData = {};
				$scope.comments = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	
	$scope.viewlikes=function(id){
		console.log("id"+id);
		$http.get('/api/viewlikes/'+ id, $scope.formData)
			.success(function(data) {
				$scope.formData = {};
				$scope.likes = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	
		
	$scope.likepost=function(id){
		console.log("id"+id);
		$http.get('/api/like/'+ id, $scope.formData)
			.success(function(data) {
				$scope.formData = {};
				$scope.likes = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	




};


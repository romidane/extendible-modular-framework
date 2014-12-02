describe('Core', function() {

	var fn;
	before(function(){
		fn = function(){
			function init(){}
			return {init: init};	
		};
	});

	beforeEach(function(){
		Core.removeAll();
		//Temp Todo refify
		sandboxes = {};
	});

	describe('#create', function() {
		it('should create a new component', function(){
			var component1 = Core.create('component1', fn);
			expect(Core.moduleList).include.keys('component1');
			expect(Core.moduleList['component1']).to.be.an('object');
			expect(sandboxes).to.include.keys('component1');
		});

		it('should throw an error if conditions are not met', function(){
			var fnTest = function(){
				Core.create('test');
			};
			var fnTest2 = function(){
				Core.create();
			};
			expect(fnTest).to.throw(Error);
			expect(fnTest2).to.throw(Error);
		});

		it('should stop the creation of a module that already exists', function(){
			var dummy = Core.create('test', fn);
			var sameDummy = function(){
				Core.create('test', fn);
			};
			expect(sameDummy).to.throw(Error);
		});
	});

	describe('#start', function() {
		it('should start a particular component', function(){
		 	var expectedInitCalled = sinon.spy();

			var moduleProvided = function(){
				return {
					init: expectedInitCalled
				};
			};
			var someModule = Core.create('stubing', moduleProvided);
			Core.start('stubing');
			expect(expectedInitCalled.called).to.be.true;
		});

		it('should throw an error if the init function is missing', function() {
			var component = Core.create('fail-1', function(){
				return {};
			});

			var start = function(){
				Core.start('fail-1');
			};

			expect(start).to.throw(Error);
		});

		it('should throw an error it the init function fails', function(){
			var component = Core.create('syntax-error', function(){
				return {
					init: function(){
						//purposely failed function
						con.log("I won't run");
					}
				};
			});

			var start = function(){
				Core.start('syntax-error');
			};
			expect(start).to.throw(Error);

		});

	});

	describe('#startAll', function() {
		var moduleProvided, moduleProvided2, moduleProvided3,spies;
		
		before(function(){
			spies = [sinon.spy(),sinon.spy(),sinon.spy()];

			moduleProvided = function(){
				return { init: spies[0] };
			};
			moduleProvided2 = function(){
				return { init: spies[1] };
			};
			moduleProvided3 = function(){
				return { init: spies[2] };
			};
		});

		it('should start all components', function() {

			Core.create("example1", moduleProvided);
			Core.create("example2", moduleProvided2);
			Core.create("example3", moduleProvided3);

			Core.startAll();

			for (var i = spies.length - 1; i >= 0; i--) {
				expect(spies[i].called).to.be.true;
			}
		});

		it('should throw an error if a module fails but still load the others', function(){

			//Component missing init
			Core.create('fail', function(){
				return {};
			});
		
			//Create other valid components
			Core.create('pass1', moduleProvided2);
			Core.create('pass2', moduleProvided3);


			var startFailComponent = function(){
				Core.start('fail');
			};
			//test to see if componentFailed throws an Error
			expect(startFailComponent).to.throw(Error);
			
						
			//start all modules
			Core.startAll();
			
			//test to see that pass1 and pass2 are initilized
			for (var i = spies.length - 1; i >= 1; i--) {
				expect(spies[i].called).to.be.true;
			}

		});
	});

	describe('#remove', function() {
		it('should remove a specified module', function() {
			Core.create('dummy1', fn);
			Core.create('dummy2', fn);

			Core.remove('dummy1');

			expect(Core.moduleList).to.not.include.keys('dummy1');
		});
	});

	describe('#removeAll', function() {
		it('should remove all modules', function() {
			Core.create('dummy1', fn);
			Core.create('dummy2', fn);

			Core.removeAll();

			expect(Core.moduleList).to.be.empty;
		});
	});
	

	afterEach(function(){
		//reset sandboxes
		Core.removeAll();
		sandboxes = {};
		//reset modules
	});

});
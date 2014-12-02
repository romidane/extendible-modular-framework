describe('Mediator', function() {
	var mediator, fn;

	before(function(){
		fn = function(){};
	});

	beforeEach(function(){
		mediator = new Mediator();
	});

	describe('#listen', function() {
		
		it('should register a new listener topic', function() {
			mediator.listen('dummy', fn);
			expect(mediator._subscribers).to.include.keys('dummy');
		});
		
		it('should prevent the creation of the same listener topic', function() {
			mediator.listen('dummy', fn);
			mediator.listen('dummy', fn);
			expect(mediator._subscribers['dummy'].length).to.equal(1);
		});
		
		it('should throw an error if the argument requirements are not met', function(){
			var error1 = function(){
				mediator.listen('dummy');
			};

			var error2 = function(){
				mediator.listen();
			};

			var error3 = function(){
				mediator.listen('dummy', {});
			};

			expect(error1).to.throw(Error);
			expect(error2).to.throw(Error);
			expect(error3).to.throw(Error);
		});

		it('should be able to have many listeners for a single topic', function() {
			var fn2 = function(){};
			var fn3 = function(){};
			mediator.listen('dummy1', fn);
			mediator.listen('dummy1', fn2);
			mediator.listen('dummy1', fn3);

			expect(mediator._subscribers['dummy1'].length).to.equal(3);
		});
	});

	describe('#notify', function() {
		
		it('should trigger the specied listeners of a topic', function() {
			var someVal;
			var changeVal = function(){ someVal = 1; };
			mediator.listen('changeSomeVal', changeVal);
			expect(someVal).to.be.undefined;
			mediator.notify('changeSomeVal');
			expect(someVal).to.equal(1);
		});

		it('should supply an event object to the listeners', function(){
			var sentence = "The word comes from a ";
			var dealWithObject = function(obj){
				sentence += obj.value;
			};
			mediator.listen('iHaveObject', dealWithObject);
			mediator.notify('iHaveObject', {value: "Object!"});

			expect(sentence).to.equal('The word comes from a Object!');

		});

		it('shoud call all the listeners of a specified topic', function(){
			var someVal = 1;
			var someOtherVal = 2;
			var yetanotherVal = 3;
			mediator.listen('changeSomeVal', function(){
				someVal++;
			});

			mediator.listen('changeSomeVal', function(){
				someOtherVal++;
			});

			mediator.listen('changeSomeVal', function(){
				yetanotherVal++;
			});

			mediator.notify('changeSomeVal');

			expect(someVal).to.equal(2);
			expect(someOtherVal).to.equal(3);
			expect(yetanotherVal).to.equal(4);

		});
	});

	describe('#silence', function() {
		
		it('should prevent prevent a listener from being called again if called once', function() {
			var value = 1;
			var increment =  function(obj){
				value++;
			};
			mediator.listen('addOneToValue', increment);
			mediator.notify('addOneToValue');
			expect(value).to.equal(2);
			mediator.silence('addOneToValue', increment);
			mediator.notify('addOneToValue');
			expect(value).to.equal(2);
		});

		it('should throw an error if the argument requirements are not met', function(){
			var error1 = function(){
				mediator.silence('dummy');
			};

			var error2 = function(){
				mediator.silence();
			};

			var error3 = function(){
				mediator.silence('dummy', {});
			};

			expect(error1).to.throw(Error);
			expect(error2).to.throw(Error);
			expect(error3).to.throw(Error);
		});


	});

	describe('#listenOnce', function() {
		
		it('should only call a listener once', function() {
			var someVal = 0;
			var someFn = function(){
				someVal++;
			};  
			mediator.listenOnce('dummy', someFn);
			mediator.notify('dummy');
			expect(someVal).to.equal(1);
			mediator.notify('dummy');
			expect(someVal).to.equal(1);
		});

		it('should throw an error if the argument requirements are not met', function(){
			var error1 = function(){
				mediator.listenOnce('dummy');
			};

			var error2 = function(){
				mediator.listenOnce();
			};

			var error3 = function(){
				mediator.listenOnce('dummy', {});
			};

			expect(error1).to.throw(Error);
			expect(error2).to.throw(Error);
			expect(error3).to.throw(Error);
		});
	});	


	describe('#kill', function() {
		it('should remove the topic along with its listeners', function(){
			mediator.listen('deleteme',fn);
			expect(mediator._subscribers).to.include.keys('deleteme');

			mediator.kill('deleteme');
			expect(mediator._subscribers).to.not.include.keys('deleteme');
		});
	});

});
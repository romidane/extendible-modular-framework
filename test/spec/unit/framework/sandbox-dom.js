describe('Sandbox Dom', function() {
	var dom, mainElement;
	before(function(){
		dom = Object.create(domComponent);
		mainElement = document.create('DIV');
		mainElement.id = "main-container";
	});

	describe('#setMain', function() {
		it('should be able to set the container', function() {
			expect(dom.elem).to.be.empty;
			
		});
	});
});
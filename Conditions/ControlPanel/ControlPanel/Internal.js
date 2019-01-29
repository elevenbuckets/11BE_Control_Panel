module.exports =
{
	ControlPanel_removeTokens_internal: (addr, jobObj) =>
	{
		try {
			let removedTokenList = jobObj.args;
			let newTokenList = Object.keys(this.CUE.Token).filter( (t) => { return removedTokenList.indexOf(t) === -1 } );
			this.CUE.Token = {}; // Reset Token ABI

			return this.hotGroups(newTokenList);
		} catch (err) {
			console.trace(err);
			return false;
		}
	}
}

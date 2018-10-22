module.exports = {
    studyplan: function(array){
        var plan = [[],[],[]]
        var totalH = 0
        var totalC = 0
        var processedInput = []
        array.forEach(function(c){
            var h = Number(c.credit)*2
            if(c.grade == 'B'){
                h = Math.ceil(h + h*0.1)
            } else if (c.grade =='C'){
                h = Math.ceil(h + h*0.15)
            } else if (c.grade == 'D'){
                h = Math.ceil(h + h*0.25)
            } else if(c.grade == 'F'){
                h = Math.ceil(h + h*0.5)
            }
            totalH += h
            totalC += Number(c.credit)
            processedInput.push([h, c.class_name])
        })
        processedInput.sort().reverse()
        processedInput.forEach(function(c){
            var h = c[0]
            var name = c[1]
            plan[0].push([Math.ceil(h*0.25), name])
            plan[2].push([Math.ceil(h*0.25), name])
            plan[1].push([h-Math.ceil(h*0.5), name])
        })
        console.log(plan)
        return [plan, totalH, totalC]    
    }
}
var chart;
var graph;
var states=['Andhra Pradesh','Andaman and Nicobar Islands','Bihar','Chandigarh','Chhattisgarh','Delhi','Goa','Gujarat','Haryana',
'Himachal Pradesh','Jammu and Kashmir','Karnataka','Kerala','Ladakh','Madhya Pradesh','Maharashtra','Manipur','Mizoram',
'Odisha','Puducherry','Punjab','Rajasthan','Tamil Nadu','Telengana','Uttarakhand','Uttar Pradesh','West Bengal']
var url="https://coronastatusindia.herokuapp.com/";
var dummy=[0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,
0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27];
window.onload=function()
{
    chart=document.getElementById("predict-chart").getContext('2d');
    graph=create_graph();
    document.querySelector(".loader-wrapper").style="display:none";
    let selection=document.getElementById("get_selection");
    load_from_api(get_selection_value(selection.value));
    selection.onchange=function(evt)
    {
        load_from_api(get_selection_value(evt.target.value));
    }
    let refresh=document.getElementById("refresh");
    refresh.onclick=function(evt)
    {
        refresh();
    }
}
function create_graph()
{
    var dChart = new Chart(chart, {
        type: 'bar',
        data: {
            labels:states,
            datasets:
            [
                {
                    label:"States",
                    data:dummy,
                    backgroundColor:
                    [
                        '#774CFF',
                        '#52F537',
                        '#FFE87D',
                        '#EB8B6C',
                        '#F943FF',
                        '#626F80',
                        '#774CFF',
                        '#52F537',
                        '#FFE87D',
                        '#EB8B6C',
                        '#F943FF',
                        '#626F80',
                        '#774CFF',
                        '#52F537',
                        '#FFE87D',
                        '#EB8B6C',
                        '#F943FF',
                        '#626F80',
                        '#774CFF',
                        '#52F537',
                        '#FFE87D',
                        '#EB8B6C',
                        '#F943FF',
                        '#626F80',
                        '#EB8B6C',
                        '#F943FF',
                        '#626F80'
                    ],
                    borderColor:'#111',
                    borderWidth: 1
                }
            ]
        },
        options:{

            responsive: true,
            maintainAspectRatio: true,
            legend:
            {
                labels:
                {
                    fontColor:'#111'
                },
                position:'right',
            }
        }
    });
    return dChart;
}
function addDataToGraph(chart,data)
{
    chart.data.datasets[0].data=data
    chart.update();
}
function removeDataFromGraph(chart)
{
    chart.data.datasets[0].data=[];
    chart.update();
}
function get_selection_value(value)
{
    let option;
    switch(value)
    {
        case 'tc':
            option="confirm-cases";
            break;
        case 'tci':
            option="confirm-cases-indian";
            break;
        case 'tcf':
            option="confirm-cases-foreign";
            break;
        case 'tcc':
            option="confirm-cured";
            break;
        case 'tcd':
            option="confirm-death";
            break;
        default:
            console.warn("No such Option");
            option=undefined;
            break;
    }
    return option;
}
function load_from_api(value)
{
    fetch(`${url}/${value}`).then(function(response)
    {
        response.json().then(function(data)
        {
            if(!data.length)
            {
                removeDataFromGraph(graph);
                addDataToGraph(graph,dummy);
                document.getElementById("cases-header").innerHTML="CASES";
                document.getElementById("total").innerHTML="";
            }
            let values=[]
            let template=document.getElementById("rows");
            let container=document.getElementById("table-body");
            let case_string=value.replace(/-/g," ").toUpperCase();
            document.getElementById("cases-header").innerHTML=case_string;
            document.getElementById("total").innerHTML=`${data[0][0]} :  ${data[0][1]}`.toUpperCase();
            for(let i=1;i<data.length;i++)
            {
                values.push(Number(data[i][1]));
                let template_clone=template.content.cloneNode(true);
                template_clone.getElementById("sno").innerHTML=i.toString();
                template_clone.getElementById("states").innerHTML=data[i][0].toString();
                template_clone.getElementById("cases").innerHTML=data[i][1].toString();
                container.append(template_clone);
            }
            removeDataFromGraph(graph);
            addDataToGraph(graph,values);
        });
    });
}
function refresh()
{
    fetch(`${url}/scapre-it`).then(function(response)
    {
        if(response)
        {
            load_from_api(get_selection_value("tc"));
        }
    });
}
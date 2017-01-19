## 问题
存在一已经排序过的数组，里面全是数字，但是又部分数字重复了，现要求去除数组中重复的数字，并返回修改后数组的长度

	例如：
    给一数组nums = [1,1,2]，
    修改过后的数组为[1,2]，
    返回的长度是2
## 解决方法
#### 方法一
`由于数组已经是排过序的，我们可以设置i, j两个下标，i始终保持 i<j，只要nums[i]=nums[j]，我们就可以增加j，来跳过重复的值，如果nums[i]!=nums[j],那么说明nums[i+1]可以被nums[j]替换掉，从而下标为让前i+1的数组数据都是有序不重复的，当j>=nums.length的时候，循环结束。JAVA代码如下：`

	 public int removeDuplicates(int[] nums) {
    	if (nums.length == 0) return 0;
    	int i = 0;
    	for (int j = 1; j < nums.length; j++) {
        if (nums[j] != nums[i]) {
            i++;
            nums[i] = nums[j];
        }
    	}
    	return i + 1;
    }

我们可以轻易得到时间复杂度为O(n)，空间复杂度为O(1)